import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import FileGrid from "@/components/FileGrid";
import TopBar from "@/components/TopBar";

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  return (
    <main style={{ minHeight: "100dvh" }}>
      <TopBar userName={session.user?.name ?? ""} />
      <FileGrid />
    </main>
  );
}
