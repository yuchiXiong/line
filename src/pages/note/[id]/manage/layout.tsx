import React from 'react';
import { Disclosure } from '@headlessui/react';
import Link from 'next/link';
import { TNote } from '@/pages/api/notes';
import Layout from '../layout';

const NoteManageLayout: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  const note: TNote = {
    title: 'test',
    id: 1,
    userId: 1,
    createdAt: new Date(),
    itemTotal: 0,
    noteItems: [],
    activities: [],
    strategies: [],
  }

  return (
    <Layout>
      <section className='flex'>
        <div className="max-w-md p-2 bg-white rounded-2xl">
          <Disclosure defaultOpen>
            <Disclosure.Button
              disabled
              className={'flex w-52 justify-between p-2 text-gray-500 text-xs font-medium'}
            >常规</Disclosure.Button>
            <Disclosure.Panel className="flex flex-col text-sm text-gray-500">
              {['编辑信息'].map(i => (
                <Link
                  key={i}
                  href={`/note/${note.id}/manage/profile`}
                  replace
                  className={`ml-2 justify-between rounded-lg
                   p-2 text-left text-sm font-medium
                   hover:bg-gray-100 focus-visible:ring `}
                >
                  {i}
                </Link>
              ))}
            </Disclosure.Panel>
          </Disclosure>
          <hr className='w-48 mx-auto my-2' />
          <Disclosure as="div" defaultOpen={true}>
            <Disclosure.Button
              className={'flex w-52 justify-between p-2 text-gray-500 text-xs font-medium'}
              disabled
            >安全</Disclosure.Button>
            <Disclosure.Panel className="flex flex-col text-sm text-gray-500">
              {['隐私操作'].map(i => (
                <Link
                  key={i}
                  href={`/note/${note.id}/manage/security`}
                  className={`ml-2 justify-between rounded-lg
                   p-2 text-left text-sm font-medium
                   hover:bg-gray-100 focus-visible:ring `}
                >
                  {i}
                </Link>
              ))}
            </Disclosure.Panel>
          </Disclosure>
        </div>

        <section className='flex-1 ml-4'>
          <main>{children}</main>
        </section>
      </section>
    </Layout>

  );
};

export default NoteManageLayout;
