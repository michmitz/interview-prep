import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method == "PUT") {
    const { id } = req.query;
    const { promptAnswer } = req.body;

    try {
      const post = await prisma.tellMePrompt.update({
        where: { id: id as string },
        data: { promptAnswer: promptAnswer },
      });
      return res.json(post);
    } catch (err) {
      console.log("ERROR", err);
    }
  } else if (req.method == "DELETE") {
    const { id } = req.query;

    try {
      const post = await prisma.tellMePrompt.delete({
        where: {
          id: id as string,
        },
      });
      return res.json(post);
    } catch (err) {
      console.log("ERROR", err);
    }
  }
}
