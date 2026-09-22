// import axios from 'axios'
// import React, { useEffect, useState } from 'react'
// import { useParams,useNavigate } from 'react-router-dom'
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { serverURL } from "@/App";

const VerifyEmail = () => {

    // const navigate = useNavigate()

    // const {token} = useParams()
    // const [Status, setStatus] = useState("Verifying....")

    // const VerifyEmail = async() => {
    //     try {
    //         const res = await axios.post(`http://localhost:5000/api/user/reverify`,{},{
    //             headers:{
    //                 Authorization: `Bearer ${token}`
    //             }
    //         })
    //         if(res.data.succuss){
    //             setStatus("✅ Email Verified Succussfully!")
    //             setTimeout(() => {
    //                 navigate("/login")
    //             }, 2000);
    //         }
    //     } catch (error) {
    //         console.log(error)
    //         setStatus("❌ Verification failed!")
    //     }
    // }

    // useEffect(() => {
    //     VerifyEmail()
    // },[token])

    //chat GPT code


  const navigate = useNavigate();

  const { token } = useParams();

  const [status, setStatus] = useState("Verifying....");

  const verifyEmail = async () => {
    try {
      console.log("Token received:", token);

      if (!token) {
        setStatus("❌ Token not found!");
        return;
      }

      const res = await axios.post(
        `${serverURL}/api/user/verify`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Backend response:", res.data);

      if (res.data.success) {
        setStatus("✅ Email Verified Successfully!");

        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setStatus("❌ Verification failed!");
      }
    } catch (error) {
      console.log("Verification error:", error.response?.data || error.message);
      setStatus("❌ Verification failed!");
    }
  };

  useEffect(() => {
    verifyEmail();
  }, [token]);
    


  return (
    <div className='relative w-full h-[760] bg-pink-100 overflow-hidden'>
      <div className='min-h-screen flex justify-center items-center'>
            <div className='bg-white p-6 rounded-2xl shadow-md text-center w-[90%] max-w-md'>
                <h2 className='text-xl font-semibold text-gray-800'>{status}</h2>
            </div>
      </div>
    </div>
  )
}

export default VerifyEmail
