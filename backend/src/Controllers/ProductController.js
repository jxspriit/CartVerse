// import Product from "../Models/productModel.js";
// import cloudinary from "../utils/cloudnary.js"; //cloudinary
// import { getDataUri } from "../utils/dataUri.js";


import Product from "../Models/productModel.js";
import cloudinary from "../utils/cloudnary.js";
import { getDataUri } from "../utils/dataUri.js";


// ===============================
// ADD PRODUCT
// ===============================
export const addProduct = async (req, res) => {
    try {
        const {
            productname,
            productdesc,
            productprice,
            category,
            brand
        } = req.body;

        // Check required fields
        if (!productname || !productdesc) {
            return res.status(400).json({
                success: false,
                message: "Product name and description are required"
            });
        }

        // Check images
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: "At least one product image is required"
            });
        }

        // Upload images to Cloudinary
        const uploadedImages = [];

        for (const file of req.files) {

            const fileData = getDataUri(file);

            const result = await cloudinary.uploader.upload(
                fileData.content,
                {
                    folder: "CartVerse/products"
                }
            );

            uploadedImages.push({
                Url: result.secure_url,
                public_id: result.public_id
            });
        }

        // Create product in MongoDB
        const product = await Product.create({
            userId: req.id,

            productname,

            productdesc,

            productImg: uploadedImages,

            productprice: Number(productprice),

            category,

            brand
        });

        return res.status(201).json({
            success: true,
            message: "Product added successfully",
            product
        });

    } catch (error) {

        console.log("ADD PRODUCT ERROR:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};



export const getAllProducts = async (req, res) => {
  try {
    // const userId = req.params.id;
    const products = await Product.find()
      .populate("userId", "firstName lastName email")
      .sort({ createdAt: -1 });

    if (!products || products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No Products Found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Products Fetched Successfully!",
      totalProducts: products.length,
      products
    });

  } catch (error) {
    console.log("GET ALL PRODUCTS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
export const getSingleProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findById(id)
            .populate("userId", "firstName lastName email");

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product Not Found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Product Fetched Successfully!",
            product
        });

    } catch (error) {
        console.log("GET SINGLE PRODUCT ERROR:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
// export const deleteProduct = async (req, res) => {
//     try {
//         const productId = req.params.id;
//         const loggedInUser = req.user;

//         // Find product
//         const product = await Product.findById(productId);

//         if (!product) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Product Not Found"
//             });
//         }

//         // Check permission
//         if (
//             product.userId.toString() !== loggedInUser._id.toString() &&
//             loggedInUser.role !== "admin"
//         ) {
//             return res.status(403).json({
//                 success: false,
//                 message: "You Are Not Allowed To Delete This Product!"
//             });
//         }

//         // Delete images from Cloudinary
//         // if (product.productImg && product.productImg.length > 0) {
//         //     for (const image of product.productImg) {
//         //         if (image.public_id) {
//         //             await cloudnary.uploader.destroy(image.public_id);
//         //         }
//         //     }
//         // }

//         // Delete product from MongoDB
//         await Product.findByIdAndDelete(productId);

//         return res.status(200).json({
//             success: true,
//             message: "Product Deleted Successfully!"
//         });

//     } catch (error) {
//         console.log("DELETE PRODUCT ERROR:", error);

//         return res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// };


export const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const loggedInUser = req.user;

        // Find product
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product Not Found"
            });
        }

        // Check permission
        if (
            product.userId.toString() !== loggedInUser._id.toString() &&
            loggedInUser.role !== "admin"
        ) {
            return res.status(403).json({
                success: false,
                message: "You Are Not Allowed To Delete This Product!"
            });
        }

        // Delete product from MongoDB FIRST
        await Product.findByIdAndDelete(productId);

        // Delete images from Cloudinary
        if (product.productImg?.length > 0) {
            for (const image of product.productImg) {
                try {
                    if (image.public_id) {
                        await cloudnary.uploader.destroy(image.public_id);
                    }
                } catch (cloudinaryError) {
                    console.log(
                        "Cloudinary image delete failed:",
                        cloudinaryError.message
                    );
                }
            }
        }

        return res.status(200).json({
            success: true,
            message: "Product Deleted Successfully!"
        });

    } catch (error) {
        console.log("DELETE PRODUCT ERROR:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


export const updateProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const loggedInUser = req.user;

        const {
            productname,
            productdesc,
            productprice,
            category,
            brand
        } = req.body;

        // Find product
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product Not Found"
            });
        }

        // Check permission
        if (
            product.userId.toString() !== loggedInUser._id.toString() &&
            loggedInUser.role !== "admin"
        ) {
            return res.status(403).json({
                success: false,
                message: "You Are Not Allowed To Update This Product!"
            });
        }

        // Update text fields
        product.productname = productname || product.productname;
        product.productdesc = productdesc || product.productdesc;
        product.productprice = productprice || product.productprice;
        product.category = category || product.category;
        product.brand = brand || product.brand;

        // If new images are uploaded
        if (req.files && req.files.length > 0) {

            // Delete old images from Cloudinary
            if (product.productImg && product.productImg.length > 0) {
                for (const image of product.productImg) {
                    if (image.public_id) {
                        await cloudnary.uploader.destroy(image.public_id);
                    }
                }
            }

            // Upload new images
            const newImages = [];

            for (const file of req.files) {

                // Convert file to Data URI
                const fileUri = getDataUri(file);

                // Upload to Cloudinary
                const uploadResult = await cloudnary.uploader.upload(
                    fileUri.content,
                    {
                        folder: "products"
                    }
                );

                newImages.push({
                    Url: uploadResult.secure_url,
                    public_id: uploadResult.public_id
                });
            }

            // Replace old images with new images
            product.productImg = newImages;
        }

        const updatedProduct = await product.save();

        return res.status(200).json({
            success: true,
            message: "Product Updated Successfully!",
            product: updatedProduct
        });

    } catch (error) {
        console.log("UPDATE PRODUCT ERROR:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


