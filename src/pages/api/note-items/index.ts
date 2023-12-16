// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import authMiddleware from '../middleware/auth';
import baseHandler from '../base';
import { NoteItem } from '@prisma/client';
import { prisma } from '@/utils/db';

export type TNoteItem = Pick<NoteItem, 'id' | 'cover' | 'title' | 'createdAt'> & {
  strategy: {
    id: number,
    name: string
  }
}

export type TSearchResult = Omit<TNoteItem, 'id'>

const handler = baseHandler()
  .post('/api/note-items', authMiddleware, async (req, res) => {
    const { currentUser } = req;
    const { noteId, noteItem } = req.body;

    const note = await prisma.note.findUnique({
      where: {
        id: noteId
      },
      select: {
        id: true,
        userId: true
      }
    });

    if (!note || note.userId !== currentUser.id) {
      return res.status(404).json({
        msg: '没有找到对应资源'
      });
    }


    const createdNoteItem = await prisma.noteItem.create({
      data: {
        title: noteItem.title,
        cover: noteItem.cover,
        strategy: {
          connect: {
            id: noteItem.strategy.id
          }
        },
        note: {
          connect: {
            id: noteId
          }
        },
        user: {
          connect: {
            id: currentUser.id
          }
        }
      },
      select: {
        id: true,
        cover: true,
        title: true,
        createdAt: true,
        strategy: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    return res.status(201).json({
      noteItem: createdNoteItem
    });

  });

export default handler;