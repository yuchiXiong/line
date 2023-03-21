import authMiddleware, { TRequestWithAuth } from '../middleware/auth';
import baseHandler from '../base';
import { TNoteItem } from '../note-items';
import { Note, Strategy } from '@prisma/client';
import { prisma } from '@/utils/db';
import { load } from 'cheerio';

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
  .get('/api/notes/:id/auto-complete', async (req: TRequestWithAuth & { id: string }, res) => {
    const { currentUser } = req;
    const { path, keyword } = req.query as { path: string[], keyword: string };
    const noteId = path[0];

    const note = (await prisma.note.findUnique({
      where: {
        id: Number(noteId)
      },
      include: {
        strategies: true
      }
    }));

    if (!note || note.userId !== currentUser.id) {
      res.status(404).json({ noteItems: [] });
      return;
    }

    const strategies = note.strategies;

    const result = (await Promise.all(strategies.map(async (strategy): Promise<Object[]> => {
      if (strategy.mode === 'API') {
        const url = strategy.source.replace('#{KEYWORD}', encodeURIComponent(keyword));
        const response = await fetch(url).then(r => r.json());
        const attrSelector = JSON.parse(strategy.attrSelector);

        const allAttrs = Object.keys(attrSelector).map((key: string) => {
          const selector = attrSelector[key];

          return fetchValueByJSON(response, selector);
        });

        return allAttrs[0].map((value, index) => {
          const item = {};
          Object.keys(attrSelector).map((key: string, keyIndex: number) => {
            item[key] = allAttrs[keyIndex][index];
          });
          item['strategy'] = {
            id: strategy.id,
            name: strategy.name,
          };
          return item;
        });


      } else if (strategy.mode === 'DOM') {
        const url = strategy.source.replace('#{KEYWORD}', encodeURIComponent(keyword));
        const response = await fetch(url).then(r => r.text());
        const attrSelector = JSON.parse(strategy.attrSelector);

        const allAttrs = Object.keys(attrSelector).map((key: string) => {
          const selector = attrSelector[key];

          return fetchValueByHTML(response, selector);
        });

        return allAttrs[0].map((value, index) => {
          const item = {};
          Object.keys(attrSelector).map((key: string, keyIndex: number) => {
            item[key] = allAttrs[keyIndex][index];
          });
          item['strategy'] = {
            id: strategy.id,
            name: strategy.name,
          };

          return item;
        });
      }

      return [];
    }))).flat();
    res.status(200).json({ noteItems: result });
  });


const fetchValueByJSON = (data: Object, selector: string): string[] => {
  let result = data;
  selector.split('.').forEach((sp) => {
    if (sp.includes('[]')) {
      result = result[sp.slice(0, sp.length - 2)];
    } else if (sp.includes('[') && sp.includes(']')) {
      const newStr = sp.slice(0, sp.length - 2);
      const key = newStr.split('[')[0];
      const index = newStr.split('[')[1];
      result = Array.isArray(result) ? result.map(r => r[key][Number(index)]).filter(r => r) : result[key][Number(index)];
    } else {
      result = Array.isArray(result) ? result.map(r => r[sp]) : result[sp];
    }
  });

  return result;
}

const fetchValueByHTML = (data: string, selector: string): string[] => {
  const $ = load(data);
  let html = $('body');
  selector.split('|').forEach((sp) => {
    // if (Array.isArray(html)) {
    //   html = html.map(h => h.find(sp));
    // } else {
    html = html.find(sp);
    // }
  });

  if (html.length === 0) return [];

  const sample = html[0];
  switch (sample.name) {
    case 'img':
      return html.map((i, el) => {
        if ($(el).attr('src')?.includes('https')) {
          return $(el).attr('src');
        } else if ($(el).attr('data-src')?.includes('https')) {
          return $(el).attr('data-src');
        } else {
          return '';
        }
      }).get();
    case 'p':
    case 'a':
      return html.map((i, el) => $(el).text()).get();
  }
}


export default handler;