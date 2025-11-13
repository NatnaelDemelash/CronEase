// /app/signup/page.tsx
import Link from "next/link";

export default function SignupComingSoon() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 text-center">
      <h1 className="text-4xl font-bold mb-4">Signup Coming Soon 🚀</h1>
      <p className="text-lg text-muted-foreground mb-6 max-w-md">
        We’re working hard to bring you signup functionality. It will be
        integrated soon. Stay tuned!
      </p>
      <Link
        href="/"
        className="inline-block rounded-lg bg-[#222] px-6 py-3 text-white font-medium hover:bg-[#333] transition-colors"
      >
        Back to Home
      </Link>
    </div>
  );
}
