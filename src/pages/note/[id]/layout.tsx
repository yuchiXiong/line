import React, { useMemo } from 'react';
import services from '@/services';
import Link from 'next/link';
import { Tab } from '@headlessui/react';
import dayjs from '@/utils/dayjs';
import { useRouter } from 'next/router';
import classNames from '@/utils/classnames';
import linkMatch from '@/utils/linkMatch';
import useSWR from "swr";
import { Return } from '@icon-park/react';

const Layout: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {

  const router = useRouter();
  const { id } = router.query as { id: string };

  const { data, error, isLoading } = useSWR(`/api/notes/${id}`, () => services.getNote(id))

  const note = data?.note;

  const TABS = useMemo(() => {
    return [
      { title: '我的项目', url: `/note/${id}/items` },
      { title: '我的概览', url: `/note/${id}/overview` },
      // todo 策略管理
      // { title: '策略管理', url: `/note/${id}/strategy` },
      { title: `管理「${note?.title}」`, url: `/note/${id}/manage/profile` }
    ];
  }, [id, note?.title]);


  return (
    <section>
      <div className='flex flex-col items-center px-8 pt-8 bg-gray-100'>
        <span className="fixed p-2 bg-gray-300 rounded-full cursor-pointer top-4 left-4" onClick={() => router.back()}>
          <Return theme="outline" size="24" fill="#333" />
        </span>

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
                      linkMatch(router.asPath, category.url)
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
