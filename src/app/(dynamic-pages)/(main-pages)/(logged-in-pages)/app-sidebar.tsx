
import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar';
import { getCachedLoggedInVerifiedSupabaseUser, getCachedIsUserLoggedIn } from '@/rsc-data/supabase';
import { Zap } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';
import { AppSidebarContent } from './app-sidebar-client';

async function SidebarHeaderContent() {
  'use cache'
  return <SidebarHeader>
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg" asChild>
          <Link href="/dashboard">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Zap className="size-4" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold" style={{ fontFamily: "'Oceanwide Pro', sans-serif" }}>photon</span>
              <span className="truncate text-xs text-muted-foreground">
                Trading Dashboard
              </span>
            </div>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  </SidebarHeader>
}



async function SidebarContentWrapper() {
  try {
    const isLoggedIn = await getCachedIsUserLoggedIn();
    if (!isLoggedIn) {
      return null;
    }
    const { user } = await getCachedLoggedInVerifiedSupabaseUser();
    return <AppSidebarContent user={user as any} />
  } catch (error) {
    return null;
  }
}


export async function AppSidebar() {
  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeaderContent />
      <Suspense fallback={null}>
        <SidebarContentWrapper />
      </Suspense>
    </Sidebar>
  );
}
