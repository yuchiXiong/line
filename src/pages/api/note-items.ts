// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import authMiddleware from './middleware/auth';
import baseHandler from './base';
import { NoteItem } from '@prisma/client';

export type TNoteItem = Pick<NoteItem, 'id' | 'cover' | 'title' | 'createdAt'> & {
  strategy: {
    id: number,
    name: string
  }
}

export type TSearchResult = Omit<TNoteItem, 'id'>

const handler = baseHandler().get(authMiddleware, (req, res) => {
  const { currentUser } = req;
  res.send({ user: currentUser });
});

export default handler;