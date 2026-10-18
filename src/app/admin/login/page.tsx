import { redirect } from "next/navigation";
import { currentAdmin } from "@/lib/admin/auth";
import { databaseConfigured } from "@/lib/db";
import LoginForm from "./LoginForm";

export default async function LoginPage() {
  if (await currentAdmin()) redirect("/admin/");
  return <LoginForm configured={databaseConfigured()} />;
}
