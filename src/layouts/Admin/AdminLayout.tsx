import { Outlet } from 'react-router-dom';
import Header from '../../components/Admin/Header';

export default function AdminLayout() {
  return (
    <div className="flex h-screen">
      <Header />
      <main className="flex-1 overflow-auto ">
        <Outlet></Outlet>
      </main>
    </div>
  );
}
