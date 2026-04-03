import { Link } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaUsers, FaAmbulance, FaHospital, FaCar } from "react-icons/fa";

export function App() {
  const navigate = useNavigate();
  const [Role, setRole] = useState("");
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  function Logout() {
    if (window.confirm("Are you sure you want to log out?")) {
      localStorage.removeItem("tokken");
      localStorage.removeItem("role");
      localStorage.setItem("toastMessage", 1);
      setRole("");
      navigate("/");
    }
  }

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (storedRole) {
      setRole(atob(storedRole));
    } else {
      setRole("");
    }
  }, []);

  return (
    <nav className="sticky top-0 z-50 border-b border-neutral-200/50 glass">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/home" className="flex items-center gap-2 group">
          <img
            src="/pics/logo1.webp"
            alt="Hyper Ambulance"
            className="h-9 w-auto group-hover:scale-105 transition-transform duration-300"
          />
        </Link>

        {/* User Nav */}
        {Role === "User" && (
          <div className="flex items-center gap-1">
            {[
              { to: "/home", label: "Home" },
              { to: "/about", label: "About" },
              { to: "/services", label: "Services" },
              { to: "/contact", label: "Contact" },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive(item.to)
                    ? "bg-black text-white shadow-lg shadow-black/20"
                    : "text-neutral-600 hover:text-black hover:bg-neutral-100"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}

        {/* Admin Nav */}
        {Role === "Admin" && (
          <div className="flex items-center gap-1">
            {[
              { to: "/trip", label: "Trips", icon: <FaCar size={14} /> },
              { to: "/ambulance", label: "Ambulance", icon: <FaAmbulance size={14} /> },
              { to: "/drivers", label: "Drivers", icon: <FaUsers size={14} /> },
              { to: "/hospital", label: "Hospitals", icon: <FaHospital size={14} /> },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive(item.to)
                    ? "bg-black text-white shadow-lg shadow-black/20"
                    : "text-neutral-600 hover:text-black hover:bg-neutral-100"
                }`}
              >
                {item.icon} {item.label}
              </Link>
            ))}
          </div>
        )}

        {/* Right Section */}
        <div className="flex items-center gap-4">
          <span className="text-sm text-neutral-500">
            {Role ? Role : "Guest"}
          </span>

          {Role ? (
            <button
              className="px-4 py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-neutral-800 hover:shadow-lg hover:shadow-black/20 transition-all duration-200"
              onClick={Logout}
            >
              Log Out
            </button>
          ) : (
            <Link
              to="/"
              className="px-4 py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-neutral-800 hover:shadow-lg hover:shadow-black/20 transition-all duration-200"
            >
              Log In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
