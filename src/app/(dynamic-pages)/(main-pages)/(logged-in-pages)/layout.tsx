import { Separator } from '@/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger
} from '@/components/ui/sidebar';
import { getCachedIsUserLoggedIn } from '@/rsc-data/supabase';
import { redirect } from 'next/navigation';
import { ReactNode, Suspense } from 'react';
import { AppSidebar } from './app-sidebar';
import { DashboardHeader } from '@/components/Layout/DashboardHeader';
import Footer from '@/components/Footer';

async function ChildrenWrapper({ children }: { children: ReactNode }) {
  const isLoggedIn = await getCachedIsUserLoggedIn();
  if (!isLoggedIn) {
    redirect('/login');
  }
  return <>{children}</>;
}

export default async function Layout({
  children,
  heading,
}: {
  children: ReactNode;
  heading: ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex flex-col min-h-screen">
        <DashboardHeader heading={heading} />
        <div className="flex-1">
        <Suspense fallback={null}>
          <ChildrenWrapper>{children}</ChildrenWrapper>
        </Suspense>
        </div>
        <Footer />
      </SidebarInset>
    </SidebarProvider>
  );
}
