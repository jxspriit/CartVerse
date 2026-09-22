import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../Models/User.model.js";
import Session from '../Models/SessionModel.js'
import { VerifyEmail } from "../emailVerify/verifyMail.js";
import {sendOtpMail} from '../emailVerify/otpMail.js'
import cloudnary from '../utils/cloudnary.js'
import dotenv from "dotenv";

dotenv.config();
//register
export const registerUser = async (req, res) => {
  console.log("🔥 REGISTER CONTROLLER CALLED");

  try {
    const {
      firstName,
      lastName,
      email,
      password,
    } = req.body;

    console.log("📩 Registration email:", email);

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "First name, last name, email and password are required",
      });
    }

    const existingUser = await User.findOne({
      email: email.trim().toLowerCase(),
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      isVerified: false,
    });

    console.log("✅ User created:", user._id);

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: "10d",
      }
    );

    console.log("🔐 Verification token created");

    // IMPORTANT: wait for email to actually send
    const emailResult = await VerifyEmail(token, user.email);

    console.log("📧 Email result:", emailResult);

    user.token = token;
    await user.save();

    console.log("✅ Registration completed");

    return res.status(201).json({
      success: true,
      message: "User registered successfully. Please verify your email.",
    });

  } catch (error) {
    console.error("❌ REGISTER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// Verify API
export const verify = async (req, res) => {

    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "Token is missing or invalid",
            });
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token is missing",
            });
        }

        let decoded;

        try {
            decoded = jwt.verify(
                token,
                process.env.SECRET_KEY
            );
        } catch (error) {
            if (error.name === "TokenExpiredError") {
                return res.status(401).json({
                    success: false,
                    message: "Verification token has expired",
                });
            }

            return res.status(401).json({
                success: false,
                message: "Token verification failed",
            });
        }

        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Correct schema fields
        user.token = null;
        user.isVerified = true;

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Email verified successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
// reVerify API
export const reVerify = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User Not Found"
            })
        }
        const token = jwt.sign({ id: user._id, }, process.env.SECRET_KEY, { expiresIn: "10m", });
        await VerifyEmail(token, email);
        user.token = token
        await user.save()
        res.status(200).json({
            success: true,
            message: "Verification Email Sent Succesfully",
            token: user.token
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}
// Login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All Feilds Are Required ...! "
            })
        }

        const existUser = await User.findOne({ email })
        if (!existUser) {
            return res.status(400).json({
                success: false,
                message: "User is already exist ...!"
            })
        }
        const isPasswordMatch = await bcrypt.compare(password, existUser.password)
        if (!isPasswordMatch) {
            return res.status(400).json({
                success: false,
                message: "Password is Not Match"
            })
        }
        if (existUser.isVerified === false)
            return res.status(400).json({
                success: false,
                message: "Please Verify Your Acount First...."
            })
        const accessToken = jwt.sign({ id: existUser._id, }, process.env.SECRET_KEY, { expiresIn: "10d", });
        const refreshToken = jwt.sign({ id: existUser._id, }, process.env.SECRET_KEY, { expiresIn: "30d", });

        existUser.isLoggedIn = true
        await existUser.save();
        // check for existing sesseion and delete 
        const ExistSession = await Session.findOne({ userId: existUser._id })
        if (ExistSession) {
            await Session.deleteOne({ userId: existUser._id })
        }
        //create new session
        await Session.create({ userId: existUser._id })
        return res.status(200).json({
            success: true,
            message: `Welcome Back ${existUser.firstName}`,
            user:existUser,
            // existUser,
            accessToken,
            refreshToken
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}
// Logout
export const logout = async (req, res) => {
    try {
        req.user.token = null;
        req.user.isLoggedIn = false;

        await req.user.save();

        return res.status(200).json({
            success: true,
            message: "Logout successful",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
// Forget Password
export const forgetPass = async (req, res) => {
    try {
        const {email} = req.body;
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({
                success:false,
                message:"User Not Found"
            })
        }
        const otp = Math.floor(100000   + Math.random()*900000).toString() // 6 digit otp
        const otpExpiry = new Date(Date.now()+10*60*1000) // 10 mins valid
        user.otp = otp
        user.otpExpiry = otpExpiry
        await user.save()
        await sendOtpMail(otp, email)

        return res.status(200).json({
            success:true,
            message:"Opt Send Successfully"
        })
    
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}
//verifyOtp
// export const verifyOtp = async (req, res) => {
//     try {
//         const {otp} = req.body;
//         // const {email} = req.params.email;
//         const { email } = req.params;
//         if(!otp){
//             return res.status(400).json({
//                 success:false,
//                 message:"Otp is Required"
//             })
//             const user =  await User.findOne({email});
//             if(!user){
//                 return res.status(400).json({
//                     success:false,
//                     message:"User Not Found"
//                 })
//             }
//             if(!user.otp || !user.otpExpiry){
//                 return res.status(400).json({
//                     success:false,
//                     message:"otp was Not Generate Or allready Verified"
//                 })
//             }
//             if(user.otpExpiry < new Date()){
//                 return res.status(400).json({
//                     success:false,
//                     message:"Otp Is expired"
//                 })
//             }
//             if(otp !== user.otp){
//                 return res.status(400).json({
//                     success:false,
//                     message:"OTP is Not Matched"
//                 })
//             }
//             user.otp = null
//             user.otpExpiry = null
//             await user.save()
//             return res.status(200).json({
//                 success:true,
//                 message:"OTP verified Successfully"
//             })
//         }
//     } catch (error) {
//         return res.status(500).json({
//             success: false,
//             message: error.message,
//         });
//     }
// }

//verifyOtp
export const verifyOtp = async (req, res) => {
    try {
        const { otp } = req.body;
        const { email } = req.params;

        // Check OTP
        if (!otp) {
            return res.status(400).json({
                success: false,
                message: "OTP is required"
            });
        }

        // Find user
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            });
        }

        // Check whether OTP exists
        if (!user.otp || !user.otpExpiry) {
            return res.status(400).json({
                success: false,
                message: "OTP was not generated or already verified"
            });
        }

        // Check OTP expiry
        if (user.otpExpiry < new Date()) {
            return res.status(400).json({
                success: false,
                message: "OTP is expired"
            });
        }

        // Check OTP
        if (otp !== user.otp) {
            return res.status(400).json({
                success: false,
                message: "OTP does not match"
            });
        }

        // Clear OTP after successful verification
        user.otp = null;
        user.otpExpiry = null;

        await user.save();

        return res.status(200).json({
            success: true,
            message: "OTP verified successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
// change Password
// export const changePass = async (req, res) => {
//     try {
//         const {newPassword, confirmPassword} = req.body;
//         const {email} = req.params;
//         const user = await User.findOne({email});
//         if(!user){
//             return res.status(400).json({
//                 success:false,
//                 message:"User Not Found"
//             })
//         }
//         if(!newPassword || !confirmPassword){
//             return res.status(400).json({
//                 success:false,
//                 message:"All Fields Are Required"
//             })
//         }
//         const hashedPassword = bcrypt.hash(newPassword, 10)
//         user.password = hashedPassword 

//         await user.save()
//         return res.status(200).json({
//             success:true,
//             message:"Password Was Changed"
//         })


//     } catch (error) {
//         return res.status(500).json({
//             success: false,
//             message: error.message,
//         });
//     }
// }

// change password
// change Password

export const changePass = async (req, res) => {
    try {
        const { newPassword, confirmPassword } = req.body;
        const { email } = req.params;

        // Check fields
        if (!newPassword || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // Check password match
        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "New password and confirm password do not match"
            });
        }

        // Find user
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password
        user.password = hashedPassword;

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password changed successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

//getting all user by only admin
export const getUser = async (req, res) => {
    try {
        const users = await User.find()
        return res.status(200).json({
            success:true,
            users
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}
// update user
export const getUserByid = async (req, res) => {
    try {
        const userId = req.params;
        const user = await User.findById(userId).select("-password -otp -otpExpiry -token")
        if(!user){
            return res.status(400).json({
                success:false,
                message:"User Not Found"
            })
        }
        return res.status(200).json({
            success:true,
            user
        })
    } catch (error) {
           return res.status(500).json({
            success: false,
            message: error.message,
         });
    }
}

// update user
// export const updateUser = async (req, res) => {
//     try {
//         const userIdToUpdate = req.params.id;
//         const loggedInUser = req.user;
//         const {firstName, lastName, address, city, zipCode, phoneNo, role} = req.body;
//         if(loggedInUser._id.toString() !== userIdToUpdate &&
//         loggedInUser.role !== 'admin'){
//             return res.status(400).json({
//                 success:false,
//                 message:"You Are Not Allowed To Update Profile!"
//             })
//         }
//         let user = await User.findById(userIdToUpdate);
//         if(!user){
//             return res.status(404).json({
//                 success:false,
//                 message:"User Not Found"
//             })
//         }
//         let profilePicUrl = user.profilePic;
//         let profilePicPublicId = user.profilePicPublicId;
//         // if new file is uploaded
//         if(req.file){
//             if(profilePicPublicId){
//                 await cloudnary.uploader.destroy(profilePicPublicId)
//             }
//             const uploadResult = await new Promise((resolve, reject)=>{
//                 const stream = cloudnary.uploader.upload_stream(
//                     {folder:"profiles"},
//                     (error, result)=>{
//                         if(error) reject(error)
//                             else resolve(result)
//                     }
//                 )
//                 stream.end(req.file.buffer)
//             })
//             profilePicUrl = uploadResult.secure_url;
//             profilePicPublicId = uploadResult.public_id
//         }
//         // update file
//         user.firstName = firstName || user.firstName;
//         user.lastName = lastName || user.lastName;
//         user.address = address || user.address;
//         user.city = city || user.city;
//         user.zipCode = zipCode || user.zipCode;
//         user.phoneNo = phoneNo || user.phoneNo;
//         user.role = role;
//         user.profilePic = profilePicUrl;
//         user.profilePicPublicId = profilePicPublicId;

//         const updatedUser = await user.save() 
//         return res.status(200).json({
//             success:true,
//             message:"Profile Updated Successfully!",
//             user: updatedUser
//         })

//     } catch (error) {
//         return res.status(500).json({
//             success: false,
//             message: error.message,
//          });
//     }
// }

export const updateUser = async (req, res) => {
    try {
        const userIdToUpdate = req.params.id;
        const loggedInUser = req.user;

        const {
            firstName,
            lastName,
            address,
            city,
            zipCode,
            phoneNo,
            role
        } = req.body;

        // Permission check
        if (
            loggedInUser._id.toString() !== userIdToUpdate &&
            loggedInUser.role !== "admin"
        ) {
            return res.status(403).json({
                success: false,
                message: "You Are Not Allowed To Update Profile!"
            });
        }

        // Find user
        let user = await User.findById(userIdToUpdate);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User Not Found"
            });
        }

        // Existing profile picture
        let profilePicUrl = user.profilePic;
        let profilePicPublicId = user.profilePicPublicId;

        // New profile picture
        if (req.file) {

            // Delete old image
            if (profilePicPublicId) {
                await cloudnary.uploader.destroy(profilePicPublicId);
            }

            // Upload new image
            const uploadResult = await new Promise((resolve, reject) => {

                const stream = cloudnary.uploader.upload_stream(
                    { folder: "profiles" },
                    (error, result) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(result);
                        }
                    }
                );

                stream.end(req.file.buffer);
            });

            profilePicUrl = uploadResult.secure_url;
            profilePicPublicId = uploadResult.public_id;
        }

        // Update profile
        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        user.address = address || user.address;
        user.city = city || user.city;
        user.zipCode = zipCode || user.zipCode;
        user.phoneNo = phoneNo || user.phoneNo;

        // Only admin can change role
        if (loggedInUser.role === "admin" && role) {
            user.role = role;
        }

        // Profile picture
        user.profilePic = profilePicUrl;
        user.profilePicPublicId = profilePicPublicId;

        const updatedUser = await user.save();

        return res.status(200).json({
            success: true,
            message: "Profile Updated Successfully!",
            user: updatedUser
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

