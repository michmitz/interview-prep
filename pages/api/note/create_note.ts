import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method == "POST") {
        const { question, advice, note } = req.body
        const result = await prisma.note.create({
            data: {
              question,
              advice,
              note,
            },
        })
        console.log("Result", result)
        return res.json(result)
    }
}
