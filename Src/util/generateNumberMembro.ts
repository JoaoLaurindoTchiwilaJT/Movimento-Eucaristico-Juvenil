export function gerarSiglaParoquia(nomeParoquia: string) {
  const limpar = nomeParoquia.toLowerCase().replace("paróquia", "").replace("paroquia", "").trim();

  const palavras = limpar.split(" ");

  const primeira = palavras[0][0].toUpperCase();
  const ultima = palavras[palavras.length - 1][0].toUpperCase();

  return primeira + ultima;
}

export function gerarCodigo(id: number, paroquia: string) {
  const numero = String(1000 + id); 

  const sigla = gerarSiglaParoquia(paroquia);

  const final = String(Math.floor(Math.random() * 999)).padStart(3, "0");

  return `${numero}${sigla}${final}`;
}
