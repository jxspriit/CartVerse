import express from 'express'
// import {registerUser, verify, reVerify, login, logout} from '../Controllers/UserController.js'
import verifyToken from '../Middleware/verifyToken.js'
import { isAdmin } from '../Middleware/verifyToken.js';
const router = express.Router();

import {
   registerUser,
   verify,
   reVerify,
   login,
   logout,
   forgetPass,
   verifyOtp,
   changePass,
   getUser,
   getUserByid,
   updateUser
} from '../Controllers/UserController.js'
import { singleUpload } from '../Middleware/multer.js';

router.post('/register', registerUser) // for registration
router.post('/verify', verify) // For email verify
router.post('/reverify', reVerify )// .....
router.post('/login', login ) // For user Login
router.post('/logout',verifyToken, logout ) //For User Logout 
router.post('/forget-pass', forgetPass ) // For user Forget Password
router.post('/verify-otp/:email', verifyOtp) //for User Forget password verify otp
router.post('/change-password/:email', changePass) // for user change password after otp verify
router.get('/all-user',verifyToken, isAdmin, getUser) // get user only by admin
router.get('/get-user/:userId', getUserByid) // get user only by admin
router.put('/update-user/:id',verifyToken, singleUpload, updateUser)//profile update



export default router;