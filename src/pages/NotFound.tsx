
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FolderX } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="w-full max-w-md text-center space-y-5">
        <div className="bg-law-blue/5 h-24 w-24 rounded-full flex items-center justify-center mx-auto">
          <FolderX className="h-12 w-12 text-law-blue" />
        </div>
        <h1 className="text-4xl font-bold text-law-blue">404 - Not Found</h1>
        <p className="text-lg text-law-neutral-dark">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <div className="pt-4">
          <Button asChild>
            <Link to="/">Return to Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
