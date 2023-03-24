import authMiddleware, { TRequestWithAuth } from '../middleware/auth';
import baseHandler from '../base';
import { TNoteItem } from '../note-items';
import { Note, NoteItem, Strategy } from '@prisma/client';
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
  action: 'create' | 'update' | 'delete',
  createdAt: string,
  auditedChanges: Note | NoteItem | Strategy
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
        noteItems: {
          include: {
            audits: true
          }
        },
        strategies: {
          include: {
            audits: true
          }
        },
        audits: true
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })).map(async (note) => {
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
        activities: [
          (await prisma.audit.findMany({
            where: {
              OR: [
                {
                  auditableId: note.id,
                  auditableType: 'Note'
                },
                ...note.noteItems.map(noteItem => ({
                  auditableId: noteItem.id,
                  auditableType: 'NoteItem'
                })),
                ...note.strategies.map(strategy => ({
                  auditableId: strategy.id,
                  auditableType: 'Strategy'
                })),
              ]
            }
          })).map(audit => ({
            ...audit,
            auditedChanges: JSON.parse(audit.auditedChanges)
          })),
        ]

      };
    });
    console.log(notes);

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
        user: {
          connect: {
            id: currentUser.id
          }
        },
        strategies: {
          create: {
            name: '豆瓣检索',
            user: {
              connect: {
                id: currentUser.id
              }
            },
            source: 'https://www.douban.com/search?q=#{KEYWORD}',
            attrSelector: JSON.stringify({
              title: '.result-list|.result|.content>.title>h3>a',
              cover: '.result-list|.result|.pic>a>img',
            }),
            mode: "DOM"
          }
        }
      }
    });

    res.status(201).json({ note });
  });

export default handler;