import express from 'express'
import verifyToken from '../Middleware/verifyToken.js'
import { isAdmin } from '../Middleware/verifyToken.js';
const router = express.Router();

import {
    addProduct,
    getAllProducts,
    deleteProduct,
    updateProduct,
    getSingleProduct
} from '../Controllers/ProductController.js'
import { singleUpload, multipleUpload } from '../Middleware/multer.js';

router.post('/add',verifyToken,isAdmin, multipleUpload , addProduct)
router.get('/get', getAllProducts)
router.delete('/delete/:id',verifyToken,isAdmin, deleteProduct) // for registration
router.put('/update/:id',verifyToken,isAdmin,multipleUpload, updateProduct)
router.get("/get/:id", getSingleProduct);



export default router;