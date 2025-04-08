import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Loader2 } from "lucide-react";

export default function AuthCallback() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const isProcessing = useRef(false);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (isProcessing.current) return;
    isProcessing.current = true;

    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    const userData = params.get("user");

    if (!token || !userData) {
      if (mounted.current) {
        setError("Authentication failed. No token received.");
        setIsLoading(false);
      }
      setTimeout(() => navigate("/login", { replace: true }), 3000);
      return;
    }

    const processAuth = async () => {
      try {
        const user = JSON.parse(decodeURIComponent(userData));
        await login(token, user);

        if (mounted.current) {
          setIsLoading(false);
          navigate("/dashboard", { replace: true });
        }
      } catch (err) {
        console.error("Error processing auth:", err);
        if (mounted.current) {
          setError("Authentication failed. Please try again.");
          setIsLoading(false);
        }
        setTimeout(() => navigate("/login", { replace: true }), 3000);
      }
    };

    processAuth();

    return () => {
      isProcessing.current = false;
    };
  }, [location.search]); // Only depend on location.search

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <Loader2 className="h-8 w-8 animate-spin text-gray-900" />
            <p className="mt-4 text-sm text-gray-600">
              Processing authentication...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">
            {error ? "Authentication Error" : "Authentication Successful"}
          </CardTitle>
          <CardDescription className="text-center">
            {error ? error : "Redirecting to dashboard..."}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          {error ? (
            <Loader2 className="h-6 w-6 animate-spin text-red-600" />
          ) : (
            <Loader2 className="h-6 w-6 animate-spin text-green-600" />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
