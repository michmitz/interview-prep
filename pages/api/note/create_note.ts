import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (req.method === "POST" && session) {
    const { question, advice, note, subject } = req.body;

    const result = await prisma.note.create({
      data: {
        question,
        advice,
        note,
        subject,
        author: { connect: { email: session?.user?.email as string } },
      },
    });
    return res.json(result);
  }
}
