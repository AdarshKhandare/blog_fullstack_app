import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { auth, endpoints } from "../api/client";

export default function Login() {
  const location = useLocation();
  const navigate = useNavigate();

  // Check if user is already authenticated
  useEffect(() => {
    if (auth.isAuthenticated()) {
      navigate("/dashboard");
    }

    // Check for error message in URL (from failed auth)
    const params = new URLSearchParams(location.search);
    const error = params.get("error");
    if (error) {
      // You could show an error toast or message here
      console.error("Authentication error:", error);
    }
  }, [navigate, location]);

  const handleGoogleLogin = () => {
    window.location.href = endpoints.auth.google;
  };

  const handleFacebookLogin = () => {
    window.location.href = endpoints.auth.facebook;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Welcome to BlogApp
          </CardTitle>
          <CardDescription className="text-center">
            Sign in to create and manage your blog posts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            variant="outline"
            className="w-full flex items-center justify-center space-x-2"
            onClick={handleGoogleLogin}>
            <FcGoogle className="h-5 w-5" />
            <span>Continue with Google</span>
          </Button>
          <Button
            variant="outline"
            className="w-full flex items-center justify-center space-x-2"
            onClick={handleFacebookLogin}>
            <FaFacebook className="h-5 w-5 text-blue-600" />
            <span>Continue with Facebook</span>
          </Button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          <div className="text-center text-sm text-gray-600">
            By signing in, you agree to our{" "}
            <a href="#" className="text-blue-600 hover:text-blue-500">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-blue-600 hover:text-blue-500">
              Privacy Policy
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
