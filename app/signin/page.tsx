import { SigninForm } from "@/components/SigninForm";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

export default async function SigninPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/movies");
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#093545] px-4 py-8">
      <SigninForm />
    </main>
  );
}
