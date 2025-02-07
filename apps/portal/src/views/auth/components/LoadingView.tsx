import { Loader } from "lucide-react";

export function LoadingView() {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <Loader />
      <div>Authenticating...</div>
    </div>
  );
}
