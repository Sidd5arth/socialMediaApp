import { SupabaseClient } from "@supabase/supabase-js";
import React, { useState, useContext, useCallback } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import AppContext from "../context/app-context";
import { useNavigate } from "react-router";
import { Circles } from "react-loader-spinner";
import { supabase } from "../SupabaseClient";
import { UserData } from "../types";

interface FormData {
  loginEmail: string;
  loginPassword: string;
  registerEmail: string;
  registerPassword: string;
  registerUsername: string;
  supabase: SupabaseClient;
}

const AuthPage: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const { userData, setUserData } = useContext(AppContext) as {
    userData: UserData;
    setUserData: React.Dispatch<React.SetStateAction<UserData>>;
  };

  const [isLoading, setIsLoading] = useState<boolean>();

  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const checkAuthentication = useCallback(async () => {
    if (
      userData?.user.id ||
      userData?.session ||
      localStorage.getItem("supabaseSession")
    ) {
      if (!userData?.user?.id) {
        const session = localStorage.getItem("supabaseSession");
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          localStorage?.removeItem("supabaseSession");
          navigate("/", { replace: true });
          return;
        }
        const token = { session: session };
        setUserData({
          user: {
            id: user.id,
            email: user.email,
            user_metadata: { first_name: user.user_metadata.first_name },
          },
          session: token,
        });
      } else {
        navigate("/Navbar", { replace: true });
      }
    }
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        localStorage.removeItem("supabaseSession");
        navigate("/", { replace: true });
        setUserData({
          user: {
            id: null,
            email: undefined,
            user_metadata: {
              first_name: null,
            },
          },
          session: null,
        });
      }
    });
    return () => {
      subscription?.unsubscribe();
    };
  }, [userData.user.id, userData.session]);

  checkAuthentication();

  const onSubmit = async (val: FormData) => {
    try {
      setIsLoading(true);
      localStorage.removeItem("supabaseSession");
      if (isLogin) {
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email: val.loginEmail,
            password: val.loginPassword,
          });
          if (data.user) {
            localStorage.setItem("supabaseSession", data.session.access_token);
            setUserData({
              user: {
                id: data.user.id,
                email: data.user.email,
                user_metadata: {
                  first_name: data.user.user_metadata.first_name,
                },
              },
              session: data.session,
            });
            toast.success("Logged in!");
            navigate("/Navbar", { replace: true });
            setIsLogin(false);
          } else {
            toast.error("Invalid details Please Register or try again");
            setIsLogin(false);
          }
        } catch (err) {
          toast.error("somthing went wrong!");
        }
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: val.registerEmail,
          password: val.registerPassword,
          options: {
            data: {
              first_name: val.registerUsername,
            },
          },
        });
        if (!error) {
          const { data: createdUser, error: dbError } = await supabase
            .from("users")
            .insert([
              {
                user_id: data.user?.id,
                username: val.registerUsername,
                email: data.user?.email,
              },
            ]);
          if (dbError) {
            toast.error(dbError.message);
          } else {
            toast.success("Registered!");
            setIsLogin(true);
          }
        } else toast.error(error.message);
      }
    } catch (err) {
      toast.success("invalid credentials");
    }
    setIsLoading(false);
  };

  return (
    <div className="max-w-md z-20 my-40 mx-auto p-12 transition-all ms-0.3 ease-in-out border-2 border-white rounded-lg bg-gray-50 bg-opacity-50 shadow-lg">
      <div className="flex justify-center mb-4 w-full transition-all ms-0.3 ease-in-out">
        <button
          className={`w-full py-2 px-4 rounded-tl-lg transition-all ms-0.3 ease-in-out ${
            isLogin
              ? "border-b-2 border-blue-500 text-blue-500"
              : "text-gray-700"
          }`}
          onClick={() => setIsLogin(true)}
        >
          Login
        </button>
        <button
          className={`w-full py-2 px-4 rounded-tr-lg transition-all ms-0.3 ease-in-out ${
            !isLogin
              ? "border-b-2 border-blue-500 text-blue-500"
              : "text-gray-700"
          }`}
          onClick={() => setIsLogin(false)}
        >
          Register
        </button>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-4">
          <input
            type="text"
            id="email"
            placeholder="Email"
            className={`w-full border-2 border-white bg-gray-50 bg-opacity-50 rounded-lg p-2 ${
              errors[isLogin ? "loginEmail" : "registerEmail"]
                ? "border-red-500"
                : ""
            }`}
            {...register(isLogin ? "loginEmail" : "registerEmail", {
              required: true,
              pattern: /^\S+@\S+$/i,
            })}
          />
          {errors[isLogin ? "loginEmail" : "registerEmail"] && (
            <p className="text-red-500">Email is required</p>
          )}
          <input
            type="password"
            id="password"
            placeholder="Password"
            className={`w-full border-2 border-white bg-gray-50 bg-opacity-50 rounded-lg p-2 ${
              errors[isLogin ? "loginPassword" : "registerPassword"]
                ? "border-red-500"
                : ""
            }`}
            {...register(isLogin ? "loginPassword" : "registerPassword", {
              required: true,
              minLength: 6,
            })}
          />
          {errors[isLogin ? "loginPassword" : "registerPassword"] && (
            <p className="text-red-500 text-sm">
              Password must be at least 6 characters long
            </p>
          )}

          {!isLogin && (
            <input
              type="text"
              id="username"
              placeholder="Username"
              className={`w-full border-2 border-white bg-gray-50 bg-opacity-50 rounded-lg p-2 ${
                errors[isLogin ? "loginPassword" : "registerPassword"]
                  ? "border-red-500"
                  : ""
              }`}
              {...register("registerUsername", { required: true })}
            />
          )}

          {isLoading ? (
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center shadow-lg shadow-blue-200">
              <Circles color="white" width={"24px"} height={"24px"} />
            </button>
          ) : (
            <button
              type="submit"
              className="border-2 border-blue-300 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-lg shadow-blue-200"
            >
              {isLogin ? "Login" : "Register"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AuthPage;
