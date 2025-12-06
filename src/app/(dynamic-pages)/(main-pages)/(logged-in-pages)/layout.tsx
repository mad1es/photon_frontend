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

async function AuthCheck({ children }: { children: ReactNode }) {
  const isLoggedIn = await getCachedIsUserLoggedIn();
  if (!isLoggedIn) {
    redirect('/login');
  }
  return <>{children}</>;
}

async function LayoutContent({
  children,
  heading,
}: {
  children: ReactNode;
  heading: ReactNode;
}) {
  return (
    <SidebarProvider>
      <Suspense fallback={null}>
        <AppSidebar />
      </Suspense>
      <SidebarInset className="flex flex-col min-h-screen">
        <DashboardHeader heading={heading} />
        <div className="flex-1">
          <Suspense fallback={<div className="flex-1 p-8">Loading...</div>}>
            <AuthCheck>{children}</AuthCheck>
          </Suspense>
        </div>
        <Footer />
      </SidebarInset>
    </SidebarProvider>
  );
}

export default async function Layout({
  children,
  heading,
}: {
  children: ReactNode;
  heading: ReactNode;
}) {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <LayoutContent heading={heading}>{children}</LayoutContent>
    </Suspense>
  );
}
