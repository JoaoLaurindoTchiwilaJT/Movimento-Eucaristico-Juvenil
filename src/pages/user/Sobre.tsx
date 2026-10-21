import { Globe2, Flame, BookOpen, Bird, Sun, Cross } from 'lucide-react';
import { motion } from "framer-motion";
import Typewriter from 'typewriter-effect';// Ajuste o caminho se o arquivo estiver em outro lugar

const historia = [
  {
    ano: '1844',
    cor: '#dc2626', // vermelho
    titulo: 'Origem no Apostolado da Oração',
    texto:
      'Um grupo de jovens jesuítas, guiados pelo Pe. Francisco Xavier Gautrelet, na França, une-se para orar e oferecer a vida pela missão da Igreja — semente do que viria a ser o MEJ.',
  },
  {
    ano: '1865–1915',
    cor: '#f97316', // laranja
    titulo: 'Da Milícia do Papa à Cruzada Eucarística',
    texto:
      'O Pe. Leonardo Cros forma a "Milícia do Papa" em Bordéus; o movimento cresce e, após o apelo do Congresso Eucarístico de Lourdes, nasce a Cruzada Eucarística Internacional.',
  },
  {
    ano: '1962',
    cor: '#2563eb', // azul
    titulo: 'Nasce o Movimento Eucarístico Juvenil',
    texto:
      'Por sugestão do Papa João XXIII, o movimento deixa o nome "Cruzada" e adota oficialmente "Movimento Eucarístico Jovem (MEJ)", com uma pedagogia renovada e mais próxima da juventude.',
  },
  {
    ano: 'Hoje',
    cor: '#16a34a', // verde
    titulo: 'Um movimento mundial',
    texto:
      'Parte da Rede Mundial de Oração do Papa, o MEJ segue vivo em mais de 60 países, formando novas gerações de mejistas na Eucaristia, na Palavra e na Missão.',
  },
];

const pilares = [
  {
    titulo: 'Oração',
    texto:
      'Rezamos com Jesus de manhã, à tarde e à noite, oferecendo a vida e refletindo sobre o dia.',
    icone: Bird,
    bg: 'bg-red-500',
  },
  {
    titulo: 'Evangelho',
    texto:
      'Escutamos e vivemos a Palavra de Deus como guia diário de vida cristã.',
    icone: BookOpen,
    bg: 'bg-blue-600',
  },
  {
    titulo: 'Eucaristia',
    texto:
      'Fazemos da Eucaristia o centro da nossa espiritualidade e projecto de vida.',
    icone: Sun,
    bg: 'bg-orange-500',
  },
  {
    titulo: 'Missão',
    texto: 'Servimos os irmãos com alegria, levando o amor de Cristo ao mundo.',
    icone: Cross,
    bg: 'bg-green-600',
  },
];

const padroeiros = [
  {
    iniciais: 'FX',
    bg: 'bg-blue-600',
    nome: 'São Francisco Xavier',
    texto:
      'Padroeiro das missões, inspira os mejistas a colocar toda a energia a serviço da missão de Cristo, indo ao encontro dos outros com coragem e generosidade.',
  },
  {
    iniciais: 'ST',
    bg: 'bg-red-500',
    nome: 'Santa Teresinha do Menino Jesus',
    texto:
      'Entrou no Apostolado da Oração aos 12 anos e ensina o "caminhozinho": viver a santidade nas pequenas coisas do dia a dia, com amor e confiança em Deus.',
  },
];

const etapas = [
  {
    faixa: '7 a 9 anos',
    titulo: 'Pré-Sementes',
    texto:
      'Preparação para a Primeira Eucaristia, primeiros passos na amizade com Jesus.',
  },
  {
    faixa: '10 a 12 anos',
    titulo: 'Semente',
    texto:
      'Grupo de perseverança: tomada de consciência sobre o valor da Eucaristia.',
  },
  {
    faixa: '13 a 15 anos',
    titulo: 'Gente Nova',
    texto:
      'Aprofundamento da fé e primeiros passos rumo ao compromisso missionário.',
  },
  {
    faixa: '16 a 25 anos',
    titulo: 'Apostolado da Oração',
    texto:
      'Vida adulta na fé: oração, comunhão frequente e serviço à Igreja e ao mundo.',
  },
];

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


export default function Sobre() {
  return (
    <div className="flex flex-col gap-12 md:gap-20">

     {/* HERO SECTION */}
      <section className="relative h-screen flex items-center bg-linear-to-br from-ambar-700 via-amber-600 to-amber-800 text-white">
        <div className="absolute inset-0 bg-[url('https://picsum.photos/id/1015/1920/1080')] bg-cover bg-center opacity-25"></div>
        
        <div className="relative max-w-7xl mx-auto px-6 pt-20">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            {/* Logo */}
            <img 
        src="src/assets/logotipo.png" // caminho do logo

alt="MEJ logo" 
              className="w-40 mb-8 drop-shadow-2xl"
            />
            
            <h1 className="text-6xl md:text-7xl font-bold leading-tight mb-6">
  Sobre o MEJ
            </h1>
            
            <p className="text-xl text-orange-100 max-w-2xl mb-10">

       Há mais de um século formando amigos de Jesus: um movimento que une
        Eucaristia, Juventude e Missão para construir, com Cristo, um mundo novo.


            </p>
            
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex items-center justify-center">
            <div className="w-1 h-2 bg-white rounded-full animate-scroll"></div>
          </div>
        </div>
      </section>


      {/* Quem somos */}
      <motion.section 
      initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
          
      className="px-6 sm:px-10 lg:px-20 py-4 sm:py-8">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">
          <div className="flex flex-col gap-6 w-full lg:w-1/2">
            <div className="flex flex-col gap-2">
              <motion.h1
              variants={fadeInUp}

              className="text-orange-950 text-3xl sm:text-4xl font-bold">
                Quem somos
              </motion.h1>
              <div className="bg-amber-400 w-16 h-1 rounded-full"></div>
            </div>
            <motion.p
                 variants={fadeInUp}
            className="text-[#535352] text-base sm:text-lg leading-relaxed">
              O Movimento Eucarístico Juvenil (MEJ) é um movimento educativo
              católico internacional voltado para crianças, adolescentes e
              jovens, presente em mais de 60 países nos cinco continentes. É o
              braço jovem da Rede Mundial de Oração do Papa, confiada pela
              Igreja aos cuidados da Companhia de Jesus.
            </motion.p>
            <p className="text-[#535352] text-base sm:text-lg leading-relaxed">
              Seguindo a pedagogia da Emaús, o MEJ integra o Evangelho, a
              Eucaristia e a Missão de forma inseparável, ajudando cada mejista
              a construir uma amizade pessoal com Jesus e a viver ao Seu estilo,
              na família, na comunidade e na sociedade.
            </p>
            <blockquote className="border-l-4 border-amber-400 pl-4 italic font-bold text-orange-950 text-base sm:text-lg">
               <Typewriter
                 options={{
                   strings: ['Somos jovens para um mundo novo e queremos ajudar a construir um mundo melhor.'],
                   autoStart: true,
                   loop: true,
                   pauseFor: 1500,
                   delay: 50,
                   cursor: '|',
                 }}
               />
             
            
            </blockquote>
          </div>

          <div className="bg-amber-400 rounded-3xl p-6 sm:p-8 w-full lg:w-1/2 flex flex-col gap-4">
            <motion.div
                 initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
            
            className="bg-white rounded-2xl p-4 flex items-center gap-4">
              <motion.div
                               variants={fadeInUp}

              className="bg-red-500 rounded-full w-12 h-12 flex items-center justify-center shrink-0">
                <Globe2 className="text-white w-6 h-6" />
              </motion.div>
              <div>
                <motion.h3
                                               variants={fadeInUp}

                className="text-orange-950 font-bold text-lg sm:text-xl">
                  60+ países
                </motion.h3>
                <motion.p 
                                               variants={fadeInUp}

                className="text-[#6b6b6a] text-sm">
                  presentes nos cinco continentes
                </motion.p>
              </div>
            </motion.div>

            <div className="bg-white rounded-2xl p-4 flex items-center gap-4">
              <motion.div
               variants={fadeInUp}
             
              className="bg-green-600 rounded-full w-12 h-12 flex items-center justify-center shrink-0">
                <Flame className="text-white w-6 h-6" />
              </motion.div>
              <div>
                <motion.h3   
                variants={fadeInUp}
                className="text-orange-950 font-bold text-lg sm:text-xl">
                  +1 milhão
                </motion.h3>
                <motion.p
                variants={fadeInUp}
                className="text-[#6b6b6a] text-sm">
                  de crianças e jovens no mundo
                </motion.p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 flex items-center gap-4">
              <motion.div
              variants={fadeInUp}
              className="bg-blue-600 rounded-full w-12 h-12 flex items-center justify-center shrink-0">
                <BookOpen className="text-white w-6 h-6" />
              </motion.div>
              <div>
                <motion.h3
                variants={fadeInUp}
                className="text-orange-950 font-bold text-lg sm:text-xl">
                  desde 1915
                </motion.h3>
                <motion.p
                variants={fadeInUp}
                className="text-[#6b6b6a] text-sm">
                  com renovação pedagógica em 1962
                </motion.p>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Nossa História */}
      <motion.section 
       initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
      
      className="bg-orange-50 px-6 sm:px-10 lg:px-20 py-10 sm:py-16">
        <div className="flex flex-col items-center gap-2 mb-10 sm:mb-16 text-center">
          <h1 className="text-orange-950 text-3xl sm:text-4xl font-bold">
            Nossa História
          </h1>
          <div className="bg-amber-400 w-35 h-1 rounded-full"></div>
          <p className="text-[#6b6b6a] text-base sm:text-lg max-w-2xl mt-2">
            Uma trajetória que atravessa mais de um século, sempre ao serviço da
            formação eucarística da juventude.
          </p>
        </div>

        <div className="relative max-w-3xl mx-auto">
          {/* linha vertical */}
          <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-amber-300"></div>

          <div className="flex flex-col gap-10 sm:gap-12">
            {historia.map((item, index) => (
              <motion.div
                            variants={fadeInUp}

              key={index} className="relative flex gap-4 sm:gap-6">
                {/* círculo indicador */}
                <div
                  className="relative z-10 flex items-center justify-center w-8 h-8 rounded-full bg-white border-2 shrink-0"
                  style={{ borderColor: item.cor }}
                >
                  <span
                    className="text-xs font-bold"
                    style={{ color: item.cor }}
                  >
                    i
                  </span>
                </div>

                <div className="flex flex-col gap-2 -mt-1">
                  <span className="bg-orange-950 text-white text-sm font-medium px-3 py-1 rounded-full w-fit">
                    {item.ano}
                  </span>
                  <h3 className="text-orange-950 text-lg sm:text-xl font-bold">
                    {item.titulo}
                  </h3>
                  <p className="text-[#535352] text-base sm:text-lg leading-relaxed">
                    {item.texto}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Espiritualidade e Pilares */}
      <section className="px-6 sm:px-10 lg:px-20 py-4 sm:py-8 flex flex-col gap-10 sm:gap-12">
        <motion.div
          initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
        
        className="flex flex-col items-center gap-2 text-center">
          <motion.h1
          variants={fadeInUp}

          className="text-orange-950 text-3xl sm:text-4xl font-bold">
            Espiritualidade e Pilares
          </motion.h1>
          <motion.div
          variants={fadeInUp}
          className="bg-amber-400 w-35 h-1 rounded-full"></motion.div>
          <motion.p
          variants={fadeInUp}
          className="text-[#535352] text-base sm:text-lg max-w-2xl mt-2">
            A espiritualidade do MEJ é centrada na Eucaristia e inspirada nos
            Exercícios Espirituais de Santo Inácio de Loyola.
          </motion.p>
        </motion.div>

        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={stagger}
        
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pilares.map((p, index) => {
            const Icone = p.icone;
            return (
              <motion.div
variants={fadeInUp}
                key={index}
                className="bg-white border border-orange-100 rounded-2xl p-6 flex flex-col items-center gap-3 text-center"
              >
                <div
                  className={`${p.bg} rounded-full w-14 h-14 flex items-center justify-center`}
                >
                  <Icone className="text-white w-6 h-6" />
                </div>
                <h3 className="text-orange-950 font-bold text-lg">
                  {p.titulo}
                </h3>
                <p className="text-[#6b6b6a] text-base leading-relaxed">
                  {p.texto}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

        <div className="bg-orange-950 rounded-2xl px-6 sm:px-10 py-8 sm:py-10 flex flex-col items-center gap-3 text-center">
          <span className="text-amber-400 text-sm font-bold tracking-widest">
            NOSSO LEMA
          </span>
          <h2 className="text-white text-xl sm:text-2xl font-bold max-w-2xl">
              <Typewriter
                 options={{
                   strings: ['Ora! Vive a Eucaristia! Serve! Prega o Evangelho, com tua vida e tua palavra!'],
                   autoStart: true,
                   loop: true,
                   pauseFor: 2000,
                   delay: 50,
                   cursor: '|',
                 }}
               />
     
          </h2>
        </div>
      </section>

      {/* Padroeiros */}
      <section
    
      
      className="bg-orange-50 px-6 sm:px-10 lg:px-20 py-10 sm:py-16 flex flex-col gap-10 sm:gap-12">
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-orange-950 text-3xl sm:text-4xl font-bold">
            Nossos Padroeiros
          </h1>
          <div className="bg-amber-400 w-35 h-1 rounded-full"></div>
        </div>

        <motion.div 
          initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={stagger}
        
        className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto w-full">
          {padroeiros.map((p, index) => (
            <motion.div
variants={fadeInUp}


              key={index}
              className="bg-white rounded-2xl p-6 flex gap-4 items-start"
            >
              <div
                className={`${p.bg} rounded-full w-14 h-14 flex items-center justify-center shrink-0 text-white font-bold`}
              >
                {p.iniciais}
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-orange-950 font-bold text-lg sm:text-xl">
                  {p.nome}
                </h3>
                <p className="text-[#6b6b6a] text-base leading-relaxed">
                  {p.texto}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Etapas do MEJ */}
      <section className="px-6 sm:px-10 lg:px-20 py-4 sm:py-8 pb-16 sm:pb-20 flex flex-col gap-10 sm:gap-12">
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-orange-950 text-3xl sm:text-4xl font-bold">
            Etapas do MEJ
          </h1>
          <div className="bg-amber-400 w-35 h-1 rounded-full"></div>
          <p className="text-[#535352] text-base sm:text-lg max-w-2xl mt-2">
            O caminho de fé é vivido em etapas, respeitando a idade e o
            crescimento de cada mejista.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {etapas.map((e, index) => (
            <div
              key={index}
              className="bg-orange-50 border-t-4 border-amber-400 rounded-2xl p-6 flex flex-col gap-2"
            >
              <span className="text-orange-600 font-bold text-sm">
                {e.faixa}
              </span>
              <h3 className="text-orange-950 font-bold text-lg">{e.titulo}</h3>
              <p className="text-[#6b6b6a] text-base leading-relaxed">
                {e.texto}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
