import { FC } from "react";
import { cn } from "@/lib/utils";

const Loader: FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="flex space-x-2">
        <div
          className={cn("w-4 h-4 bg-white rounded-full animate-bounce")}
        ></div>
        <div
          className={cn(
            "w-4 h-4 bg-white rounded-full animate-bounce delay-200"
          )}
        ></div>
        <div
          className={cn(
            "w-4 h-4 bg-white rounded-full animate-bounce delay-400"
          )}
        ></div>
      </div>
    </div>
  );
};

export default Loader;
