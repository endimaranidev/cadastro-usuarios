import { PrismaClient } from "@prisma/client";
import cors from "cors";

const prisma = new PrismaClient();

const handler = async (req, res) => {
  // Permite o CORS, já que express não lida com isso automaticamente
  cors()(req, res, async () => {
    if (req.method === "GET") {
      // Lógica para buscar os usuários
      let users = [];
      if (req.query.name) {
        users = await prisma.user.findMany({
          where: {
            name: {
              startsWith: req.query.name,
            },
          },
        });
      } else {
        users = await prisma.user.findMany();
      }
      return res.status(200).json(users);
    }

    if (req.method === "POST") {
      // Lógica para criar um usuário
      const { name, age, email } = req.body;
      const newUser = await prisma.user.create({
        data: { name, age, email },
      });
      return res.status(201).json(newUser);
    }

    if (req.method === "PUT") {
      // Lógica para atualizar um usuário
      const { id } = req.query;
      const { name, age, email } = req.body;
      const updatedUser = await prisma.user.update({
        where: { id },
        data: { name, age, email },
      });
      return res.status(200).json(updatedUser);
    }

    if (req.method === "DELETE") {
      // Lógica para deletar um usuário
      const { id } = req.query;
      await prisma.user.delete({
        where: { id },
      });
      return res.status(200).json({ message: "Usuário deletado com sucesso!" });
    }

    return res.status(405).json({ message: "Método não permitido" });
  });
};

export default handler;
