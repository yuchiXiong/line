import React, { useMemo, useState, useEffect } from 'react';
import services from '@/services';
import Link from 'next/link';
import { Tab } from '@headlessui/react';
import dayjs from '@/utils/dayjs';
import { TNote } from '@/pages/api/notes';
import { useRouter } from 'next/router';
import classNames from '@/utils/classnames';

const Layout: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {

  const { id } = useRouter().query as { id: string };
  const [note, setNote] = useState<TNote>({
    title: '',
    id: -1,
    userId: -1,
    createdAt: new Date(),
    itemTotal: 0,
    noteItems: [],
    activities: [],
    strategies: [],
  });

  useEffect(() => {
    services.getNote(id).then(res => {
      setNote(res.note);
    }, () => { });
  }, [id]);

  const TABS = useMemo(() => {
    return [
      { title: '我的概览', url: `/note/${id}/overview` },
      { title: '我的项目', url: `/note/${id}/items` },
      // todo 策略管理
      // { title: '策略管理', url: `/note/${id}/strategy` },
      { title: `管理「${note?.title}」`, url: `/note/${id}/manage/profile` }
    ];
  }, [id, note?.title]);


  return (
    <section>
      <div className='flex flex-col items-center px-8 pt-8 bg-gray-100'>
        <p className='text-2xl text-gray-700 '>「{note?.title}」</p>
        <p className='flex items-center mt-2 text-sm'>
          <span>{'@yuchiXiong'}</span>
          <span className="block w-0.5 h-0.5 rounded mx-2 bg-black"></span>
          <span
            title={dayjs(note?.createdAt).format('YYYY年MM月DD日 HH:mm:ss')}
          >
            创建于 {dayjs(note?.createdAt).fromNow()}
          </span>
        </p>

        <div className="px-2 pt-8 min-w-max w-72">
          <Tab.Group>
            <Tab.List className="flex p-1 space-x-1">
              {TABS.map(category => (
                <Link
                  key={category.title}
                  href={category.url || '/'}
                  replace
                  className={
                    classNames(
                      'w-max py-2 px-2 text-sm font-normal leading-5',
                      'focus:outline-none box-border border-b-2 border-solid',
                      false
                        ? 'border-red-400'
                        : 'border-transparent text-gray-400'
                    )
                  }
                >{category.title}</Link>
              ))}
            </Tab.List>
          </Tab.Group>
        </div>
      </div>

      <div className='container min-h-screen mx-auto my-8'>
        <main>{children}</main>
      </div>
    </section>
  );
};

export default Layout;
