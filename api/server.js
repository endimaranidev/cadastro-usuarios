import express from "express";
import { PrismaClient } from "@prisma/client";
import cors from 'cors'

const prisma = new PrismaClient();
const app = express();
//  O express por padrão não usa json:
app.use(express.json());
app.use(cors())

app.post("/users", async (req, resp) => {
	await prisma.user.create({
		data: {
			name: req.body.name,
			age: req.body.age,
			email: req.body.email,
		},
	});

	resp.status(201).json(req.body);
});

app.get("/users", async (req, resp) => {
   let users = []
	
   if(req.query) {
      users = await prisma.user.findMany({
         where: {
            name: {
               startsWith: req.query.name,
            },
         }
      })
   } else {
      users = await prisma.user.findMany();
   }
   

	resp.status(200).json(users); //resp.json porque está salvando como json em users
});

app.put("/users/:id", async (req, resp) => {
	await prisma.user.update({
		where: {
			id: req.params.id,
		},
		data: {
			name: req.body.name,
			age: req.body.age,
			email: req.body.email,
		},
	});

	resp.status(200).json(req.body);
});

app.delete('/users/:id', async (req, resp) => {
   await prisma.user.delete({
      where: {
         id: req.params.id
      }
   })

   resp.status(200).json({ message: "Usuário deletado com sucesso!" })
})

export default app;
