import { createClient } from "redis";

const redis = createClient({
  url: "redis://127.0.0.1:6379"
});

redis.on("error", (err) => {
  console.error("Erro no Redis:", err);
});

export async function connectRedis() {
  if (!redis.isOpen) {
    await redis.connect();
    console.log("Redis conectado!");
  }
}

export default redis;
  // export async function salvarImagem(imagem: any, local: string) {
    
  //   redis.on

  //     return {
  //     nomeOriginal: imagem.filename,
  //     nameFile,
  //     mimetype: imagem.mimetype,
  //     caminho
  //   };
  // }
