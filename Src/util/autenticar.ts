import { FastifyReply, FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";

export async function verifyJWT(req: FastifyRequest, res: FastifyReply) {
  
    try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).send({ message: "Token não fornecido" });
    }

    // Header no formato "Bearer <token>"
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).send({ message: "Token inválido" });
    }

    const secret = String(process.env.SECRETE_PASS);

    // verifica o token
    const decoded = jwt.verify(token, secret);
    // você pode adicionar o payload decodificado no request para usar depois
    (req as any).user = decoded;
  } catch (err) {
    return res.status(401).send({ message: "Token inválido ou expirado" });
  }

}
