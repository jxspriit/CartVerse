import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { EyeIcon, EyeOff, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { serverURL } from "@/App";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setloading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    console.log(formData);
    try {
        setloading(true)
        const res = await axios.post(`${serverURL}/api/user/register`, formData,{
            headers:{
                "Content-Type": "application/json"
            }
        })
        if(res.data.success){
            navigate("/verify")
            toast.success(res.data.message)
        }
    } catch (error) {
        console.log(error)
        toast.error(error.response.data.message)
    } finally{
        setloading(false)
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-pink-100">
      <Card className="w-full max-w-sm">

        <CardHeader>
          <CardTitle>Create your account</CardTitle>

          <CardDescription>
            Enter Given Details Below To Create Account
          </CardDescription>
        </CardHeader>

        <CardContent>

          <form onSubmit={submitHandler}>

            <div className="flex flex-col gap-3">

              {/* First Name + Last Name */}
              <div className="grid grid-cols-2 gap-4">

                <div className="grid gap-2">
                  <Label htmlFor="firstName">
                    First Name
                  </Label>

                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="John"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="lastName">
                    Last Name
                  </Label>

                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="Doe"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </div>

              </div>

              {/* Email */}
              <div className="grid gap-2">

                <Label htmlFor="email">
                  Email
                </Label>

                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter Your E-mail"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />

              </div>

              {/* Password */}
              <div className="grid gap-2">

                <div className="flex items-center">

                  <Label htmlFor="password">
                    Password
                  </Label>

                  {/* <Link
                    to="/forgot-password"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forget Password?
                  </Link> */}

                </div>

                <div className="relative">

                  <Input
                    id="password"
                    name="password"
                    placeholder="Create a Password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="pr-10"
                  />

                  {showPassword ? (
                    <EyeOff
                      onClick={() => setShowPassword(false)}
                      className="w-5 h-5 text-gray-700 absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
                    />
                  ) : (
                    <EyeIcon
                      onClick={() => setShowPassword(true)}
                      className="w-5 h-5 text-gray-700 absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
                    />
                  )}

                </div>

              </div>

              {/* Submit Button */}
              <Button 
                type="submit"
                className="w-full mt-2 cursor-pointer"
              >
                {loading? <><Loader2 className="h-4 w-4 animate-spin mr-2"/> Please wait</>:'Sign Up'}  
              </Button>

            </div>

          </form>

        </CardContent>

        <CardFooter className="flex-col gap-2">

          <Link to="/login">
            <p className="hover:underline cursor-pointer text-gray-700 text-sm">
              Already Have An Account? <b>Login</b>
            </p>
          </Link>

        </CardFooter>

      </Card>
    </div>
  );
};

export default Signup;


