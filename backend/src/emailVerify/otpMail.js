import nodemailer from 'nodemailer';
import dotenv from "dotenv";
dotenv.config();

export const sendOtpMail = async (otp, email) =>{
    const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

    const mailConfigurations = {

    // It should be a string of sender/server email
    from: process.env.MAIL_USER,

    to: email,

    // Subject of Email
    subject: 'Password reset One Time Password',
    
   html:`<p>Your Reset Password Otp Is : <b>${otp}</b></p>`
};
    transporter.sendMail(mailConfigurations, function(error, info){
    if (error) throw Error(error);
    console.log('OTP Sent Successfully');
    console.log(info);
});
}







