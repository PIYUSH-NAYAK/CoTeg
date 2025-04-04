// src/components/Navbar.jsx
import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, logout } from "../auth";

const Navbar = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const menuRef = useRef();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 shadow-md flex justify-between items-center relative">
      <Link to="/home" className="text-2xl font-bold text-blue-400">
        Coteg
      </Link>

      {user && (
        <div className="relative" ref={menuRef}>
          <img
            src={  "../Profile.jpg "} // ✅ loads from public/Profile.jpg
            alt="Profile"
            className="w-10 h-10 rounded-full cursor-pointer object-cover"
            onClick={() => setOpen(!open)}
          />

          {open && (
            <div className="absolute right-0 mt-2 w-48 bg-black text-gray-100 rounded-lg shadow-lg z-50 overflow-hidden">
              <div className="px-4 py-2 border-b border-gray-200">
                <p className="font-semibold text-sm">
                  {user.displayName || "User"}
                </p>
                <p className="text-xs text-gray-600 truncate">{user.email}</p>
              </div>
              <button
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-300 text-red-600 text-sm"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
