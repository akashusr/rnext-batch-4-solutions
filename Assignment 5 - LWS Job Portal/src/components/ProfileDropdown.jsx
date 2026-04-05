import { User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const ProfileDropdown = () => {
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef();

  const handleLogout = () => {
    setAuth({});
    localStorage.removeItem("auth");
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative bg-gray-100 rounded-2xl" ref={ref}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="btn btn-ghost text-sm cursor-pointer"
      >
        <User className="h-4 w-4 mx-3 bg-gray-200 rounded-full"></User>{" "}
        {auth?.user?.data?.name || "Account"}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-md z-50">
          <button
            className="block w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
            onClick={() => navigate("/user-dashboard")}
          >
            Dashboard
          </button>
          <button
            className="block w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
            onClick={() => navigate("/profile")}
          >
            Profile
          </button>
          <hr className="my-1" />
          <button
            className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500 cursor-pointer"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
