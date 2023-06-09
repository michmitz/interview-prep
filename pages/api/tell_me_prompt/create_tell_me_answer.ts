import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  console.log("session", session)

  if (req.method === "POST" && session) {
    
    try {
      const { promptAnswer } = req.body;
      console.log("prompt answer in api", promptAnswer)
      const result = await prisma.tellMePrompt.create({
        data: {
          promptAnswer,
          author: { connect: { email: session?.user?.email as string } },
        },
      });
      return res.json(result);
    } catch (err) {
      console.log("ERROR:", err);
      return err;
    }
  }
}
