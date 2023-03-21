import authMiddleware, { TRequestWithAuth } from '../middleware/auth';
import baseHandler from '../base';
import { TNoteItem } from '../note-items';
import { Note, Strategy } from '@prisma/client';
import { prisma } from '@/utils/db';

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
  .get('/api/notes/:id', async (req: TRequestWithAuth & { id: string }, res) => {
    const { currentUser } = req;
    const { noteId } = req.query;

    const note = (await prisma.note.findUnique({
      where: {
        id: Number(noteId)
      },
      include: {
        noteItems: {
          orderBy: {
            createdAt: 'desc'
          }
        },
        strategies: true
      }
    }));

    /**
     * 1. 如果没有找到对应的 note
     * 2. 如果 note 已经被删除
     * 3. 如果 note 不属于当前用户
     */
    if (!note || note.discardedAt !== null || note?.userId !== currentUser.id) {
      res.status(404).json({ msg: '没有找到对应资源' });
      return;
    }

    res.status(200).json({
      note: {
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
      }
    });
  }).delete('/api/notes/:id', async (req: TRequestWithAuth & { id: string }, res) => {
    const { currentUser } = req;
    const { noteId } = req.query;

    const note = (await prisma.note.findUnique({
      where: {
        id: Number(noteId)
      },
      include: {
        noteItems: true,
        strategies: true
      }
    }));

    if (note?.userId !== currentUser.id) {
      res.status(403).json({ msg: '没有找到对应资源' });
      return;
    }

    if (!note) {
      res.status(404).json({ msg: '没有找到对应资源' });
      return;
    }

    note.discardedAt = new Date();
    await prisma.note.update({
      where: {
        id: note.id
      },
      data: {
        discardedAt: note.discardedAt
      }
    });


    res.status(200).json({});
  });

export default handler;