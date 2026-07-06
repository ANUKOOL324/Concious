import { useEffect, useRef, useState } from "react";
import { Button } from "../components/common/Button";
import { Input } from "../components/common/Input";
import { Backendurl } from "../config";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Design } from "./Design";
import { logged } from "../HelperFunction/authcheck";
import { getAuthErrorMessage } from "../HelperFunction/errorHandler";
import toast from "react-hot-toast";

export function Signup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const usernameRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (logged()) {
      navigate("/dashboard");
    }
  }, [navigate]);

  async function signup() {
    const username = usernameRef.current?.value?.trim();
    const password = passwordRef.current?.value;

    if (!username && !password) {
      toast.error("Please enter your username and password.");
      return;
    }

    if (!username) {
      toast.error("Please enter your username.");
      return;
    }

    if (!password) {
      toast.error("Please enter your password.");
      return;
    }

    if (username.length < 3) {
      toast.error("Username must be at least 3 characters long.");
      return;
    }

    if (username.length > 10) {
      toast.error("Username must not exceed 10 characters.");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }

    if (password.length > 20) {
      toast.error("Password must not exceed 20 characters.");
      return;
    }

    if (!/[A-Z]/.test(password)) {
      toast.error("Password must contain at least one uppercase letter.");
      return;
    }

    if (!/[a-z]/.test(password)) {
      toast.error("Password must contain at least one lowercase letter.");
      return;
    }

    if (!/[0-9]/.test(password)) {
      toast.error("Password must contain at least one number.");
      return;
    }

    if (!/[^A-Za-z0-9]/.test(password)) {
      toast.error("Password must contain at least one special character.");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(`${Backendurl}/api/v1/signup`, {
        username,
        password,
      });

      toast.success(res.data.message ?? "Signed up successfully!");
      navigate("/signin");
    } catch (error) {
      toast.error(getAuthErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative w-full h-dvh overflow-hidden">
      <div className="flex z-0">
        <Design />
      </div>

      <div className="absolute inset-0 z-10 bg-gray" />

      <div className="absolute inset-0 z-20 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-xl w-[360px] p-8">
          <h2 className="text-2xl font-semibold text-center mb-4">
            Create your account
          </h2>

          <div className="flex flex-col gap-2 items-center">
            <Input reference={usernameRef} placeholder="Username" />
            <Input
              reference={passwordRef}
              placeholder="Password"
              type="password"
            />
            <p className="text-xs text-gray-500 px-2 -mt-1">
              8–20 chars with uppercase, lowercase, number, and special character.
            </p>
          </div>

          <div className="mt-4">
            <Button
              Loading={loading}
              ProvoFunc={signup}
              variety="Sign"
              text={loading ? "Creating account..." : "Signup"}
              fullWidth={true}
            />
          </div>

          <p className="text-sm text-center mt-4 text-gray-600">
            Already registered?{" "}
            <span
              onClick={() => !loading && navigate("/signin")}
              className="text-blue-600 cursor-pointer hover:underline"
            >
              Sign in
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
