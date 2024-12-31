import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { CiLogout } from "react-icons/ci";
import { useAuth } from "../Pages/Contexts/AuthContext";

const Profile = ({ isAuthenticated }) => {
  const { logout } = useAuth();
  const [email, setEmail] = useState(null); // State to hold the email
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch email on component load
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
// Profile route to fetch only email
router.get('/profile', auth, async (req, res) => {
    try {
      // Fetch user based on ID and only return the email
      const user = await User.findById(req.user.id).select('email');
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user); // Only email will be returned due to .select('email')
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  });
  
        const data = await response.json();
        setEmail(data.email); // Only set the email in state
      } catch (error) {
        console.error("Error fetching email:", error);
        toast.error("An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchEmail();
  }, [isAuthenticated, navigate]);

  // Handle Logout
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) return <div className="text-center">Loading profile...</div>;
  if (!email) return <div className="text-center">No profile found.</div>;

  return (
    <div className="hidden lg:flex flex-col items-center justify-center bg-neutral-800 h-full p-4">
      <div className="bg-black w-full flex flex-col items-center p-6 shadow-lg rounded-lg profile">
        {/* Display only the email */}
        <div className="text-center mt-4">
          <span className="text-lg font-bold text-white">{email}</span>
        </div>
      </div>

      {/* Logout button */}
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
