import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);
const bucket = process.env.SUPABASE_BUCKET!;

export async function streamToBuffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
  const chunks: Buffer[] = [];

  for await (const chunk of stream) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  return Buffer.concat(chunks);
}

export async function fileUpload(
  local: string,
  idLocal: number,
  typeFile: string,
  filename: string,
  arquivo: Buffer,
  mimetype: string,
) {


  console.log("Bytes recebidos:", arquivo.length);
  // Pegar a extensão original
  const extensao = filename.split(".").pop();

  // Gerar identificador único
  const identificador = randomUUID();

  // Novo nome do arquivo
  const novoFilename = `${identificador}.${extensao}`;

  // Montar caminho
  const caminho = `${local}/${idLocal}/${typeFile}/${novoFilename}`;

  const { data, error } = await supabase.storage.from(bucket).upload(caminho, arquivo, {
    contentType: mimetype,
    upsert: false,
  });

  if (error) {
    console.error("Erro no upload:", error);
    throw error;
  }

    // console.log("Upload realizado com sucesso!");
    // console.log(data);

  return {
    ...data,
    filename: novoFilename,
    path: data.path,
  };
}

export async function getFileUrl(caminho: string) {
  const bucket = process.env.SUPABASE_BUCKET!;

  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(caminho, 60 * 60);

  if (error) {
    console.error("Erro ao gerar URL:", error);
    throw error;
  }

  return data.signedUrl;
}

export async function deleteFile(path: string) {
  const { data, error } = await supabase.storage.from(bucket).remove([path]);

  if (error) {
    console.error("Erro ao eliminar arquivo:", error);
    throw error;
  }

  return data;
}

export async function updateFile(path: string, arquivo: Buffer, mimetype: string) {
  const { data, error } = await supabase.storage.from(bucket).update(path, arquivo, {
    contentType: mimetype,
    upsert: true,
  });

  if (error) {
    console.error("Erro ao atualizar arquivo:", error);
    throw error;
  }

  return data;
}
