import { Calendar, CheckCircle, Mail, Lock, User } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../features/auth/authSlice";
import { useNavigate, Link } from "react-router-dom";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object().shape({
  name: yup.string().required("Full name is required"),
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  password_confirmation: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm your password"),
});

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const result = await dispatch(registerUser(data));
      if (result && !error) {
        // On success, navigate to login page
        navigate("/login")
      }
    } catch (err) {
      // Error handling is now managed by Redux state
      console.error("Registration failed:", err);
    }
  };

  // Add useEffect to handle successful registration
  useEffect(() => {
    if (status === "succeeded") {
      // Wait a bit before redirecting to show the success message
      const timer = setTimeout(() => {
        alert("Registration successfully!");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [status, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-2">
        {/* Left Section */}
        <div className="bg-gradient-to-br from-purple-600 to-indigo-700 p-12 text-white flex flex-col justify-center">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                <Calendar className="w-7 h-7 text-purple-600" />
              </div>
              <h1 className="text-4xl font-bold">Eventify</h1>
            </div>
            <h2 className="text-3xl font-bold mb-4 leading-tight">
              Discover & Join Amazing Events
            </h2>
            <p className="text-purple-100 text-lg mb-8">
              Join thousands of users discovering and attending events every
              day.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                title: "Browse Events",
                desc: "Discover events tailored to your interests",
              },
              {
                title: "Easy Registration",
                desc: "One-click registration for any event",
              },
              {
                title: "Stay Updated",
                desc: "Get notifications for upcoming events",
              },
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                  <p className="text-purple-100 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Section */}
        <div className="p-12">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Create Account
            </h2>
            <p className="text-gray-600">
              Join Eventify and start discovering events
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Full Name */}
            {/* Add this error display section */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-red-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <div className="text-sm text-red-600">
                      {typeof error === "object" ? (
                        <ul className="list-disc list-inside">
                          {Object.entries(error).map(([field, messages]) => (
                            <li key={field}>
                              {Array.isArray(messages) ? messages[0] : messages}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        error
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Success message */}
            {status === "succeeded" && (
              <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-green-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-600">
                      Registration successful! Redirecting to login...
                    </p>
                  </div>
                </div>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  {...register("name")}
                  type="text"
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition"
                  placeholder="John Doe"
                />
              </div>
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  {...register("email")}
                  type="email"
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition"
                  placeholder="john@example.com"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  {...register("password")}
                  type="password"
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition"
                  placeholder="••••••••"
                />
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  {...register("password_confirmation")}
                  type="password"
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition"
                  placeholder="••••••••"
                />
              </div>
              {errors.password_confirmation && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password_confirmation.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              {status === "loading" ? "Creating Account..." : "Create Account"}
            </button>

            <p className="text-center text-sm text-gray-600 mt-4">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-purple-600 font-semibold cursor-pointer hover:underline"
              >
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
