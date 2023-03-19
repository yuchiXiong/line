import authMiddleware, { TRequestWithAuth } from '../middleware/auth';
import baseHandler from '../base';
import { TNoteItem } from '../note-items';
import { Note, Strategy } from '@prisma/client';
import { prisma } from '@/utils/db';
import { NextApiResponse } from 'next';

export type TNote = Pick<Note, 'id' | 'title' | 'userId' | 'createdAt'> & {
  itemTotal: number,
  noteItems: TNoteItem[],
  activities: IActivity[],
  strategies: Strategy[],
}

export interface IActivity {
  id: number,
  auditableType: string,
  action: 'create',
  createdAt: string,
  auditedChanges: {
    title: 'RG 普通版 RG11 ZGMF-X42S 命运高达',
    noteId: 3,
    userId: 1,
    strategyId: 3,
    cover: 'https://bbs-attachment-cdn.78dm.net/upload/2021/07/d9754b4fa6f61a6cbcabc6d85643165a-w320h320'
  }
}

const handler = baseHandler({ attachParams: true })
  .use<TRequestWithAuth>(authMiddleware)
  .get('/api/notes', async (req: TRequestWithAuth, res: NextApiResponse<{ msg: string } | { notes: TNote[] }>) => {
    const { currentUser } = req;

    const notes = (await prisma.note.findMany({
      where: {
        userId: currentUser.id,
        discardedAt: null
      },
      include: {
        noteItems: true,
        strategies: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })).map(note => {
      return {
        ...note,
        noteItems: note.noteItems.map(noteItem => {
          const s = note.strategies.find(strategy => strategy.id === noteItem.strategyId);
          return {
            ...noteItem,
            strategy: {
              id: s!.id,
              name: s!.name
            }
          };
        }),
        itemTotal: note.noteItems.length,
        activities: []
      };
    });

    res.status(200).json({ notes });
  }).post('/api/notes', async (req: TRequestWithAuth, res) => {
    const { currentUser } = req;
    const { title }: { title: string } = req.body;

    if (title.trim() === '') {
      res.status(400).json({ msg: '标题不能为空' });
      return;
    }

    const note = await prisma.note.create({
      data: {
        title,
        userId: currentUser.id
      }
    });

    res.status(201).json({ note });
  });

export default handler;