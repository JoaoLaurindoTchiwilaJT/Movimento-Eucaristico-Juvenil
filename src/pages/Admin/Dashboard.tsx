import { Card } from '@/components/ui/card';
import logotipo from '@/assets/logotipo.png';

export default function Dashboard() {
  return (
    <div
      style={{
        backgroundImage: logotipo,
        width: 100,
        height: 100,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        opacity: 10,
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="w-screen max-w-[80vw] flex flex-col justify-center items-center p-6 gap-15">
        <div className="w-full px-12">
          <h1 className="text-xl font-black text-amber-800">Dashboard</h1>
          <div className="bg-amber-800 w-35 h-1 rounded-md"></div>
        </div>
        <div className="w-full flex items-center px-10 gap-30 ">
          <div className="shadow-[0_4px_30px_rgba(0,0,0,0.1)] bg-white rounded-md py-2 px-5">
            QTDMEMBROS
          </div>
          <div className="shadow-[0_4px_30px_rgba(0,0,0,0.1)] bg-white rounded-md py-2 px-5">
            QTDPAROQUIAS
          </div>
          <div className="shadow-[0_4px_30px_rgba(0,0,0,0.1)] bg-white rounded-md py-2 px-5">
            QTDCENTROS
          </div>
        </div>
        <div className="grid grid-cols-3 px-10  gap-15">
          <Card className="ring-0 w-80 h-60 shadow-[0_5px_30px_rgba(0,0,0,0.1)] "></Card>
          <Card className="ring-0 w-80 h-60 shadow-[0_5px_30px_rgba(0,0,0,0.1)] "></Card>
          <Card className="ring-0 w-80 h-60 shadow-[0_5px_30px_rgba(0,0,0,0.1)] "></Card>
          <Card className="ring-0 w-80 h-60 shadow-[0_5px_30px_rgba(0,0,0,0.1)] "></Card>
          <Card className="ring-0 w-80 h-60 shadow-[0_5px_30px_rgba(0,0,0,0.1)] "></Card>
        </div>
      </div>
    </div>
  );
}
