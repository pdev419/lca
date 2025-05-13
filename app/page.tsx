import { supabase } from "./lib/supabase";
import Heading from "./ui/heading";
import DashboardClient from "./dashboard-client";

async function Page() {
  const { data: projects, error } = await supabase
    .from("project")
    .select("*")
    .order("edited_at", { ascending: false });

  if (error) {
    console.error("Error fetching projects:", error);
  }

  return (
    <>
      <Heading title="Dashboard" />
      <DashboardClient projects={projects || []} />
    </>
  );
}

export default Page;
