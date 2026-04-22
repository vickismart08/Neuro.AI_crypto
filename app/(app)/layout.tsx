import RequireAuth from '@/components/auth/RequireAuth';
import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';
import BottomNav from '@/components/layout/BottomNav';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth>
      <div className="flex min-h-screen min-w-0 overflow-x-hidden bg-[#050b18]">
        <Sidebar />
        <div className="flex min-h-screen min-w-0 flex-1 flex-col lg:ml-64">
          <Topbar />
          <main className="w-full min-w-0 max-w-[1400px] flex-1 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8">
            {children}
          </main>
        </div>
        <BottomNav />
      </div>
    </RequireAuth>
  );
}
