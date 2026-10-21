import Header from '@/components/Admin/Header';
import { Outlet } from 'react-router-dom';


export default function AdminLayout() {
  return (
    <div className="flex h-screen">
      <Header />
      <main className="flex-1 overflow-auto pt-14 md:pt-0">
        <Outlet />
      </main>
    </div>
  );
}