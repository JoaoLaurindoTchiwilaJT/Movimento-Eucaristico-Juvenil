import bcrypt from "bcrypt";

export class Criptografia {
  public async criptografar(hash: string): Promise<string> {
    try {
      const hashe = await bcrypt.hash(hash, 10);

      return hashe;
    } catch (error) {
      console.error(error);
      throw error;
    }
  } 

  public descriptografar(hash: string, senha: string): boolean {
    try {
      const hashes = bcrypt.compareSync(hash, senha);

      return hashes;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
