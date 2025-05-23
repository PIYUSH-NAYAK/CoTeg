import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

const Login = () => {
  const navigate = useNavigate();
  const { user, signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      navigate("/home");
    }
  }, [user, navigate]);

  const handleLogin = async () => {
    setError("");
    try {
      const result = await signInWithEmail(email, password);
      if (!result) throw new Error("No account found with this email or incorrect password.");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSignup = async () => {
    setError("");
    try {
      const result = await signUpWithEmail(email, password);
      if (!result) throw new Error("Could not sign up. Email might already be linked to Google. Try Google login.");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    try {
      const result = await signInWithGoogle();
      if (!result) throw new Error("Google Sign-In failed.");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold text-center mb-6">Welcome Back</h2>

        <button
          onClick={handleGoogleSignIn}
          className="flex items-center justify-center w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-50 mb-6"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-5 h-5 mr-2"
          />
          Sign in with Google
        </button>

        <div className="flex items-center justify-between mb-4">
          <hr className="w-1/2 border-gray-300" />
          <span className="px-2 text-gray-400 text-sm">or</span>
          <hr className="w-1/2 border-gray-300" />
        </div>

        <input
          type="email"
          placeholder="Email"
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-2 mb-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && (
          <p className="text-red-500 text-center mb-4 text-sm">
            {error}
          </p>
        )}

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition mb-3"
        >
          Sign In
        </button>

        <p className="text-sm text-center text-gray-600">
          Don’t have an account?{" "}
          <button
            onClick={handleSignup}
            className="text-blue-600 hover:underline"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
