import { Loader } from "lucide-react";

export function LoadingView() {
  return (
    <div style={{ height: '100vh', width: '100vw', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Loader />
      <div>Authenticating...</div>
    </div>
  );
}
