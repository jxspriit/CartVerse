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

import { ArrowLeft, EyeIcon, EyeOff, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/userSlice";
import { serverURL } from "@/App";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setloading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

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
      setloading(true);

      const res = await axios.post(
        `${serverURL}/api/user/login`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data.success) {
        navigate("/");
        dispatch(setUser(res.data.user));
        localStorage.setItem("accessToken", res.data.accessToken);
        toast.success(res.data.message);
      }
  } catch (error) {
  console.log("Login Error:", error);

  toast.error(
    error.response?.data?.message ||
    "Unable to connect to server. Please try again."
  );
} finally {
  setloading(false);
}
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen bg-pink-100">

      {/* Back Button */}
      <button
        type="button"
        onClick={() => navigate("/")}
        className="absolute left-5 top-5 flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-100 hover:text-pink-600"
      >
        <ArrowLeft size={18} />
        Back
      </button>

      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Login your account</CardTitle>

          <CardDescription>
            Enter Given Details Below To Login Account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={submitHandler}>
            <div className="flex flex-col gap-3">

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

                  <Link
                    to="/forgot-password"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forget Password?
                  </Link>
                </div>

                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    placeholder="Enter Your a Password"
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
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Please wait
                  </>
                ) : (
                  "Login"
                )}
              </Button>

            </div>
          </form>
        </CardContent>

        <CardFooter className="flex-col gap-2">
          <Link to="/signup">
            <p className="hover:underline cursor-pointer text-gray-700 text-sm">
              You Don't Have An Account? <b>Sign Up</b>
            </p>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;