import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method == "PUT") {
        const { id } = req.query;
        const { note } = req.body;
        const post = await prisma.note.update({
            where: { id: id as string },
            data: { note: note },
        })
        return res.json(post);
    } else if (req.method == "DELETE") {
        const { id } = req.query;
        const post = await prisma.note.delete({
            where: {
                id: id as string,
            },
        });
        return res.json(post);
    }
}
