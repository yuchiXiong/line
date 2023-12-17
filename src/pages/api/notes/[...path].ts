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
        strategies: {
          where: {
            NOT: {
              mode: 'NONE',
              isDeleted: false
            }
          }
        }
      }
    }));

    if (!note || note.userId !== currentUser.id) {
      res.status(404).json({ noteItems: [] });
      return;
    }

    const strategies = note.strategies;

    const result = (await Promise.all(strategies.map(async (strategy): Promise<Object[]> => {
      const url = strategy.source.replace('#{KEYWORD}', encodeURIComponent(keyword));
      const attrSelector = JSON.parse(strategy.attrSelector);
      let allAttrs: Array<string[]> = [];

      if (strategy.mode === 'API') {
        const response = url.includes('douban.com')
          ? await fetch(url, {
            headers: {
              "Referer": "https://www.douban.com/search?q=%E5%AE%87%E5%AE%99",
            }
          }).then(r => r.json())
          : await fetch(url).then(r => r.json());

        allAttrs = Object.keys(attrSelector).map((key: string) => fetchValueByJSON(response, attrSelector[key]));

      } else if (strategy.mode === 'DOM') {
        const response = await fetch(url).then(r => r.text());

        allAttrs = Object.keys(attrSelector).map((key: string) => fetchValueByHTML(response, attrSelector[key]));
      }

      return (allAttrs[0] || []).map((_, index) => {
        const item = {
          /** key 为用户自定义添加的 attrSelector 对象结构的 key */
          [Object.keys(attrSelector)[0]]: '',
          strategy: {}
        };
        Object.keys(attrSelector).map((key: string, keyIndex: number) => {
          item[key] = allAttrs[keyIndex][index];
        });
        item['strategy'] = {
          id: strategy.id,
          name: strategy.name,
        };

        return item;
      });

    }))).flat();

    res.status(200).json({ noteItems: result });
  });

/**
 * @description 根据 JSON 结构获取数据
 * TODO: 目前实现了 key[] 和 key[index] 两种情况，理论上后者可以支持数组下标与对象属性，但需要进一步测试
 * 
 * @param {Object} data - JSON 数据
 * @param {string} selector - JSON 结构选择器，格式参考：books[].bookInfo.title
 * @returns {string[]}
 */
const fetchValueByJSON = (data: Object, selector: string): string[] => {
  selector.split('.').forEach((sp) => {
    if (sp.includes('[]')) {

      /** 包含 [] 则接下来的结果为一个数组 */
      data = (data as any)[sp.slice(0, sp.length - 2)];
    } else if (sp.includes('[') && sp.includes(']')) {

      /** 包含 key[index] 则接下来的结果为对象的一个属性 */
      const [key, index] = sp.slice(0, sp.length - 2).split('[');
      data = Array.isArray(data)
        ? data.map(r => r[key][Number(index)]).filter(r => r)
        : (data as any)[key][Number(index)];
    } else {

      /** 否则直接获取对象的一个属性 */
      data = Array.isArray(data)
        ? data.map(r => r[sp])
        : (data as any)[sp];
    }
  });

  return data as string[];
}

/**
 * @description 根据 HTML 结构获取数据
 * @param {string} data - HTML 数据
 * @param {string} selector - CSS 选择器，格式参考：.result-list|.result|.content>.title>h3>a
 * @returns 
 */
const fetchValueByHTML = (data: string, selector: string): string[] => {
  const $ = load(data);
  let html = $('body');
  selector.split('|').forEach(sp => html = html.find(sp));

  if (html.length === 0) return [];

  /** 根据第一个 HTML 元素的类型选择使用对应的方式获取标签的内容/属性 */
  const sample = html[0];

  switch (sample.name) {
    case 'img':
      return html.map((_, el) => {
        const src = $(el).attr('src');
        const dataSrc = $(el).attr('data-src');

        return src?.includes('https')
          ? src
          : dataSrc?.includes('https')
            ? dataSrc
            : '';

      }).get();
    case 'p':
    case 'a':
      return html.map((i, el) => $(el).text()).get();
  }

  return [];
}


export default handler;