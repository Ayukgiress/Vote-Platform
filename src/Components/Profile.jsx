import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { CiLogout } from "react-icons/ci";
import { useAuth } from "../Pages/Contexts/AuthContext";

const Profile = ({ isAuthenticated }) => {
  const { logout } = useAuth();
  const [email, setEmail] = useState(null); 
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmail = async () => {
      const token = localStorage.getItem("token");
      if (!isAuthenticated || !token) {
        navigate("/dashboard");
        return;
      }

      try {
        const response = await fetch("http://localhost:5000/users/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          toast.error(errorData.error || "Failed to fetch email.");
          return;
        }

  
        const data = await response.json();
        setEmail(data.email); 
      } catch (error) {
        console.error("Error fetching email:", error);
        toast.error("An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchEmail();
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) return <div className="text-center">Loading profile...</div>;
  if (!email) return <div className="text-center">No profile found.</div>;

  return (
    <div className="hidden lg:flex flex-col items-center justify-center bg-neutral-800 h-full p-4">
      <div className="bg-black w-full flex flex-col items-center p-6 shadow-lg rounded-lg profile">
        <div className="text-center mt-4">
          <span className="text-lg font-bold text-white">{email}</span>
        </div>
      </div>

      <div className="flex items-center justify-center mt-10">
        <button
          onClick={handleLogout}
          className="flex items-center text-white text-xl bg-red-600 px-4 py-2 rounded transition duration-200 hover:bg-red-500"
        >
          <CiLogout className="mr-2" /> Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
