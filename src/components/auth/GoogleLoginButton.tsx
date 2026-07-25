import { useEffect, useRef } from "react";

declare global {
  interface Window { google?: any; }
}

interface GoogleLoginButtonProps {
  onOtpReady: (email: string, token: string) => void;
  onPhoneRequired: (token: string) => void;
  onError: (msg: string) => void;
  loginWithGoogle: (idToken: string, phone?: string) => Promise<any>;
}

export const GoogleLoginButton = ({
  onOtpReady,
  onPhoneRequired,
  onError,
  loginWithGoogle,
}: GoogleLoginButtonProps) => {
  const btnRef = useRef<HTMLDivElement>(null);
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  // Keep latest callbacks in a ref so the Google callback always has fresh ones
  const cbRef = useRef({ onOtpReady, onPhoneRequired, onError, loginWithGoogle });
  useEffect(() => {
    cbRef.current = { onOtpReady, onPhoneRequired, onError, loginWithGoogle };
  });

  const initGoogle = () => {
    if (!window.google || !btnRef.current || !clientId) return;

    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: async (response: { credential: string }) => {
        const idToken = response.credential;
        try {
          const result = await cbRef.current.loginWithGoogle(idToken);
          if (result?.success) {
            cbRef.current.onOtpReady(result.data.email, idToken);
          } else if (result?.requiresPhone) {
            cbRef.current.onPhoneRequired(idToken);
          } else {
            cbRef.current.onError(result?.message || "Google login failed");
          }
        } catch {
          cbRef.current.onError("Something went wrong. Please try again.");
        }
      },
    });

    window.google.accounts.id.renderButton(btnRef.current, {
      theme: "outline",
      size: "large",
      width: btnRef.current.offsetWidth || 380,
      text: "continue_with",
    });
  };

  useEffect(() => {
    if (!clientId) return;
    if (window.google) { setTimeout(initGoogle, 100); return; }
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => setTimeout(initGoogle, 100);
    document.head.appendChild(script);
  }, [clientId]);

  if (!clientId) {
    return (
      <div className="w-full text-center text-xs text-muted-foreground border rounded-md p-3">
        VITE_GOOGLE_CLIENT_ID not set in .env
      </div>
    );
  }

  return <div ref={btnRef} style={{ minHeight: 44, width: "100%" }} />;
};
