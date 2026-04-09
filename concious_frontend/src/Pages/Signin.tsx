import { useRef, useState } from "react";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { Backendurl } from "../config";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Design } from "./Design";

export function Signin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const usernameRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);

  async function signin() {
    setLoading(true);

    const username = usernameRef.current?.value;
    const password = passwordRef.current?.value;

    try {
      const res = await axios.post(`${Backendurl}/api/v1/signin`, {
        username,
        password,
      });
      const jwt = res.data.token;
      // console.log(jwt);
      localStorage.setItem("Token", jwt);
      alert("Signed in successfully!");
      navigate("/Dashboard"); // or dashboard
    } catch {
      alert("Invalid credentials!");
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
            Welcome Back
          </h2>

          <div className="flex flex-col gap-2 items-center">
            <Input reference={usernameRef} placeholder="Username" />
            <Input reference={passwordRef} placeholder="Password" />
          </div>

          <div className="mt-4">
            <Button
              Loading={loading}
              ProvoFunc={signin}
              variety="Sign"
              text="Signin"
              fullWidth={true}
            />
          </div>

          <p className="text-sm text-center mt-4 text-gray-600">
            Not registered?{" "}
            <span
              onClick={() => navigate("/Signup")}
              className="text-blue-600 cursor-pointer hover:underline"
            >
              Create an account
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
