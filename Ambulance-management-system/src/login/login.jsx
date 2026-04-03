import { useState, useEffect } from "react";
import "./login.css";
import { login } from "../api";
import { useNavigate } from "react-router-dom";
import { App } from "../navbar/navbar";
import { Footer } from "../footer/footer";
import { LiveBackground } from "../livebg/LiveBackground";
import { ToastContainer, toast, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Eye, EyeOff } from "lucide-react";
import { ButtonLoader } from "../loader/Loader";

export function Login() {
  const [showPassword, setShowPassword] = useState(false);

  function closeAlert() {
    setMessage("");
  }
  const [userRole, setUserRole] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("toastMessage")) {
      toast.success("Logout Successful...", {
        transition: Zoom,
        autoClose: 3000,
      });
      localStorage.removeItem("toastMessage");
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");
    setLoggingIn(true);
    login(userRole, password)
      .then((response) => {
        if (response.data.status === "success") {
          localStorage.setItem("tokken", btoa(response.data.access_token));
          localStorage.setItem("role", btoa(userRole));
          localStorage.setItem("toastMessage", 1);
          navigate("/home");
        } else {
          setPassword("");
          setMessage("Wrong Credentials");
        }
      })
      .finally(() => setLoggingIn(false));
  };

  return (
    <>
      <App />
      <div className="min-h-screen bg-white flex items-center justify-center px-4 relative">
        <LiveBackground />
        <ToastContainer />

        <div className="w-full max-w-md relative z-10 animate-scale-in">
          {/* Login Card */}
          <div className="glass border-2 border-black rounded-2xl p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-shadow duration-300">
            {message && (
              <div className="relative bg-black text-white text-sm p-4 rounded-lg mb-6 animate-fade-in">
                <span
                  className="absolute top-2 right-3 cursor-pointer text-lg hover:opacity-70"
                  onClick={closeAlert}
                >
                  &times;
                </span>
                {message}
              </div>
            )}

            <h1 className="text-3xl font-bold text-black text-center mb-8">
              Login
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6" method="POST">
              <div className="animate-fade-in-up delay-100">
                <label
                  htmlFor="userRole"
                  className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2"
                >
                  Role
                </label>
                <select
                  id="userRole"
                  name="userRole"
                  value={userRole}
                  onChange={(e) => setUserRole(e.target.value)}
                  required
                  className="w-full p-3 bg-neutral-50/80 border border-neutral-200 rounded-lg text-black focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                >
                  <option value="" disabled>
                    Select your role
                  </option>
                  <option value="Admin">Admin</option>
                  <option value="User">User</option>
                </select>
              </div>

              <div className="animate-fade-in-up delay-200">
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full p-3 bg-neutral-50/80 border border-neutral-200 rounded-lg text-black focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all pr-12"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="animate-fade-in-up delay-300">
                <button
                  type="submit"
                  disabled={loggingIn}
                  className="w-full py-3 font-semibold text-white bg-black rounded-lg hover:bg-neutral-800 hover:shadow-xl hover:shadow-black/20 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loggingIn ? <ButtonLoader /> : "Sign In"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
