import { Button } from '@/components/ui/button';
import { UserRound, CalendarDays, MapPin, ShoppingCart } from 'lucide-react';
import foto from '@/assets/Grupo 22.png';
import { EspiritualidadeIcon, ComunhaoIcon, MissaoIcon } from '@/lib/icons';
import procissao from '@/assets/procissao.jpg';
import camisola from '@/assets/camisola.png';
import { motion } from "framer-motion";

function Dots({ className = '' }: { className?: string }) {
  return (
    <div className={`grid grid-cols-4 gap-2 ${className}`}>
      {Array.from({ length: 20 }).map((_, i) => (
        <div key={i} className="w-1.5 h-1.5 rounded-full bg-white" />
      ))}
    </div>
  );
}

const sobreItems = [
  {
    icon: <EspiritualidadeIcon />,
    title: 'Espiritualidade',
    desc: 'Centramos na Eucaristia e fortalecemos nossa vida com Deus.',
  },
  {
    icon: <ComunhaoIcon />,
    title: 'Comunhão',
    desc: 'Vivemos a amizade e a unidade, construindo laços que transformam.',
  }, 
  {
    icon: <MissaoIcon />,
    title: 'Missão',
    desc: 'Levamos o amor de Cristo ao mundo com alegria e serviço.',
  },
];

function SectionTitle({ title }: { title: string }) {
  return (
    <div className="flex flex-col w-full items-center mb-2">
      <h1 className="text-orange-950 font-medium text-3xl sm:text-4xl">{title}</h1>
      <div className="bg-yellow-400 rounded-full h-1 w-20 mt-1" />
    </div>
  );
}

export default function Home() {
  // Variantes para entrada suave dos cards
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const stagger = {
    visible: {
      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  return (
    <div>
      {/* ── HERO ── */}
      <div className="bg-yellow-300 px-6 sm:px-10 md:px-16 lg:px-20 py-10 md:py-14 lg:py-16 relative overflow-hidden min-h-104 md:min-h-[31rem] lg:min-h-[35rem]">
        {/* Bolinhas flutuantes */}
  
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
          className="bg-green-500 w-8 h-8 rounded-full absolute top-1/2 -translate-y-1/2 -left-2 z-10"
        />
        <motion.div
          animate={{ y: [0, -18, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut', delay: 0.4 }}
          className="bg-blue-700 w-10 h-10 rounded-full absolute top-[15%] left-6 z-10"
        />
        <motion.div
          animate={{ y: [10, -20, 10] }}
          transition={{ duration: 2.8, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut', delay: 0.3 }}
          className="bg-red-500 w-14 h-14 rounded-full absolute top-6 right-6 z-10"
        />
        <motion.div
          animate={{ y: [6, -28, 6] }}
          transition={{ duration: 4.2, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut', delay: 0.2 }}
          className="bg-blue-400 w-10 h-10 rounded-full absolute top-[38%] right-[50%] z-10"
        />
        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 3.2, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
          className="bg-green-500 w-8 h-8 rounded-full absolute bottom-[28%] right-[38%] z-10"
        />
        <motion.div
          animate={{ y: [4, -20, 4] }}
          transition={{ duration: 3.8, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
          className="bg-orange-400 w-12 h-12 rounded-full absolute bottom-6 right-[35%] z-10"
        />
        <motion.div
          animate={{ y: [0, -22, 0] }}
          transition={{ duration: 4, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut', delay: 0.5 }}
          className="bg-red-700 w-6 h-6 rounded-full absolute bottom-8 left-[18%] z-10"
        />

        <Dots className="absolute top-4 opacity-60 left-[60%] z-10" />
        <Dots className="absolute bottom-4 left-2 z-0 opacity-60" />

        {/* Imagem lateral (desktop) */}
        <div className="hidden lg:block absolute -top-13 right-0 h-full w-[52%] z-0">
          <img src={foto} alt="Imagem MEJ" className="h-[45rem] w-[45rem] object-contain" />
        </div>

        {/* Conteúdo do hero */}
        <div className="relative z-10 flex flex-col justify-center gap-1 text-center lg:text-left w-full lg:max-w-[50%]">
          <motion.h1
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 120, damping: 10 }}
            className="font-black text-[5rem] sm:text-[7rem] md:text-[9rem] lg:text-[11rem] xl:text-[13rem] leading-none tracking-tighter text-orange-950"
          >
            MEJ
          </motion.h1>

          <div className="flex items-center justify-center lg:justify-start flex-wrap px-2 text-lg sm:text-xl md:text-2xl font-bold gap-2 sm:gap-3 text-orange-950">
            <h2>Eucaristia</h2>
            <div className="bg-red-500 w-3 h-3 rounded-full shrink-0" />
            <h2>Juventude</h2>
            <div className="bg-blue-500 w-3 h-3 rounded-full shrink-0" />
            <h2>Missão</h2>
          </div>

          <div className="bg-orange-950 w-12 h-[2px] rounded-full mx-auto lg:mx-2 mt-2" />

          <p className="text-orange-950 font-semibold text-sm sm:text-base mt-4 mx-auto lg:mx-0 lg:ml-2 leading-relaxed">
            Tudo por vós, <br /> Sagrado Coração de Jesus
          </p>

          <div className="px-2 py-4 flex justify-center lg:justify-start gap-3 flex-wrap">
            <Button
              className="
                border border-orange-950
                px-5 h-10 rounded-2xl
                bg-orange-950 text-white
                font-semibold
                flex items-center gap-2
                cursor-pointer
                transition-all ease-in-out duration-200
                hover:scale-105 hover:shadow-[0_8px_20px_-4px_rgba(124,45,18,0.55)]
                focus-visible:scale-105 focus-visible:shadow-[0_8px_20px_-4px_rgba(124,45,18,0.55)]
                focus-visible:outline-none
                active:scale-95
                shadow-md shadow-orange-950/30
              "
            >
              <UserRound size={16} />
              Cadastrar-se
            </Button>
          </div>
        </div>
      </div>

      {/* ── CONTEÚDO ── */}
      <section className="p-4 relative overflow-hidden">
        {/* Bolinhas decorativas de fundo */}
        <div className="bg-green-500 w-8 h-8 rounded-full absolute top-1/2 -translate-y-1/2 -left-2 z-[-1]" />
        <div className="bg-blue-700 w-10 h-10 rounded-full absolute top-[15%] left-6 z-[-1]" />
        <div className="bg-red-500 w-14 h-14 rounded-full absolute top-6 right-6 z-[-1]" />
        <div className="bg-blue-400 w-10 h-10 rounded-full absolute top-[38%] right-[50%] z-[-1]" />
        <div className="bg-orange-400 w-12 h-12 rounded-full absolute bottom-6 right-[35%] z-[-1]" />
        <div className="bg-red-700 w-6 h-6 rounded-full absolute bottom-8 left-[18%] z-[-1]" />

        {/* ── SOBRE ── */}
        <div className="mt-8">
          <SectionTitle title="Sobre" />
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 sm:px-8 lg:px-16 py-8"
          >
            {sobreItems.map((item) => (
              <motion.div
                key={item.title}
                variants={fadeInUp}
                className="
                  group
                  flex items-start gap-4
                  p-5
                  rounded-2xl
                  bg-white
                  border border-orange-950/10
                  shadow-sm
                  transition-all duration-300 ease-in-out
                  hover:shadow-md hover:shadow-orange-950/10
                  hover:-translate-y-1
                  hover:border-orange-950/20
                "
              >
                <div className="
                  shrink-0
                  flex items-center justify-center
                  w-11 h-11
                  rounded-xl
                  bg-orange-950/5
                  text-orange-950
                  transition-colors duration-300
                  group-hover:bg-orange-950/10
                ">
                  {item.icon}
                </div>

                <div className="flex flex-col gap-1">
                  <h3 className="text-orange-950 text-lg sm:text-xl font-semibold leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-sm sm:text-[15px] text-neutral-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* ── ACTIVIDADES ── */}
        <div className="mt-4">
          <SectionTitle title="Actividades" />
          <div className="flex flex-col lg:flex-row gap-8 px-4 sm:px-8 lg:px-16 py-8">
            {/* Destaque */}
            <div
              style={{
                backgroundImage: `url(${procissao})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
              className="flex flex-col text-white shadow-2xl gap-6 p-5 w-full lg:w-[320px] shrink-0 rounded-xl"
            >
              <div className="text-orange-950 font-medium rounded-full w-28 h-8 flex items-center justify-center bg-yellow-400 p-2">
                <p>Destaque</p>
              </div>
        
              <div className="flex flex-col gap-2 text-sm">
                <div className="flex gap-2 items-center">
                  <CalendarDays size={16} /> 18 a 21 de Junho de 2026
                </div>
                <div className="flex gap-2 items-center">
                  <MapPin size={16} /> Nossa Senhora de Fátima
                </div>
              </div>
              <div className="text-orange-950 font-medium rounded-md w-28 h-8 flex items-center justify-center bg-yellow-400 p-2 cursor-pointer">
                <p>Saiba mais</p>
              </div>
            </div>

            {/* Cards de actividades */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 w-full">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex flex-col rounded-xl shadow-xl overflow-hidden">
                  <div
                    className="flex p-4 w-full h-44"
                    style={{
                      backgroundImage: `url(${procissao})`,
                      backgroundPosition: 'center',
                      backgroundSize: 'cover',
                    }}
                  >
                    <div className="flex flex-col justify-center items-center shadow h-14 w-14 bg-white text-red-600 font-bold rounded-md">
                      <p>07</p>
                      <p>JUN</p>
                    </div>
                  </div>
                  <div className="flex flex-col p-4 gap-2">
                    <h1 className="text-orange-950 font-black">Grupo de Oração</h1>
                    <div className="flex flex-col gap-1 text-sm">
                      <div className="flex gap-2 items-center">
                        <CalendarDays size={16} className="text-orange-950" /> 07 de junho de 2026
                      </div>
                      <div className="flex gap-2 items-center">
                        <MapPin size={16} className="text-orange-950" /> Paróquia Santa Mãe de Deus
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── LOJA MEJ ── */}
        <div className="mt-4">
          <SectionTitle title="Loja MEJ" />
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4 sm:px-8 lg:px-16 py-8">
            {Array.from({ length: 4 }).map((_, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05, y: -4 }}
                className="rounded-xl shadow-lg flex flex-col overflow-hidden"
              >
                <div className="h-40 flex justify-center items-center bg-gray-50">
                  <motion.img
                    whileHover={{ scale: 1.15 }}
                    src={camisola}
                    className="h-36 object-contain cursor-pointer"
                    alt="Camiseta MEJ"
                  />
                </div>
                <div className="border flex flex-col p-4 gap-2">
                  <h1 className="text-lg sm:text-xl font-bold text-orange-950">Camiseta</h1>
                  <p className="text-sm sm:text-base">AKZ 2.500</p>
                  <Button className="bg-amber-400 w-full sm:w-35 text-orange-950 cursor-pointer hover:bg-amber-500 hover:scale-105">
                    <ShoppingCart size={16} /> Comprar
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}