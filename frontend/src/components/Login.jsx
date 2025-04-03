import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, signInWithGoogle, signInWithEmail, signUpWithEmail, logout } from "../auth";

const Login = () => {
  const navigate = useNavigate();
  const [user] = useAuthState(auth); // Listen for auth state changes

  useEffect(() => {
    if (user) {
      navigate("/home"); // Redirect to homepage if logged in
    }
  }, [user, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <button 
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 mb-4"
        onClick={signInWithGoogle}
      >
        Sign in with Google
      </button>
      <hr className="w-full mb-4" />
      <button 
        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
        onClick={logout}
      >
        Logout
      </button>
    </div>
  );
};

export default Login;
