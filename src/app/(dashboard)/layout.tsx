import { Sidebar } from "@/components/dashboard/sidebar";
import TopUser from "@/components/dashboard/top-user";
import {
  SidebarInset,
  Topbar,
  PageContent,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { cookies } from "next/headers";

export default async function Home({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = cookies();
  const sidebarState = (await cookieStore).get("sidebar_state");

  let defaultOpen = true;
  if (sidebarState) {
    defaultOpen = sidebarState.value === "true";
  }

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <Sidebar />

      <SidebarInset>
        <Topbar>
          <TopUser />
        </Topbar>

        <PageContent>
          {children}
        </PageContent>
      </SidebarInset>
    </SidebarProvider>
  );
}
