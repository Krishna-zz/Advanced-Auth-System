"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Button, Input } from "@/components/ui/primitives";

export const AuthForm = ({ mode }: { mode: "login" | "signup" }) => {
  const router = useRouter();
  const { signIn, signUp } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") ?? "");
    const password = String(fd.get("password") ?? "");
    const displayName = String(fd.get("displayName") ?? "");
    if (!email || !password || (mode === "signup" && !displayName)) {
      setError("All fields are required.");
      return;
    }
    if (mode === "signup" && password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      if (mode === "signup") {
        await signUp(email, password, displayName);
      } else {
        await signIn(email, password);
      }
      router.push("/dashboard");
    } catch {
      setError("Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="mx-auto mt-16 w-full max-w-md space-y-3 rounded-lg border p-6">
      <h1 className="text-2xl font-semibold">{mode === "signup" ? "Create account" : "Log in"}</h1>
      {mode === "signup" && <Input name="displayName" placeholder="Display name" required />}
      <Input name="email" type="email" placeholder="Email" required />
      <Input name="password" type="password" placeholder="Password" required />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button disabled={loading} type="submit" className="w-full">
        {loading ? "Please wait..." : mode === "signup" ? "Sign up" : "Login"}
      </Button>
    </form>
  );
};
