import React from 'react';
import NoteItem from '../note-item';
import { Right } from '@icon-park/react';
import { TNote } from '@/pages/api/notes';
import Link from 'next/link';

const Note: React.FC<{
  note: TNote,
}> = ({
  note
}) => {

    return (
      <div className="flex flex-col px-10 pt-10">

        <div className="flex items-center mb-6">
          <h1 className="text-2xl text-gray-900">「{note.title}」</h1>

          <Link
            href={`/note/${note.id}/overview`}
            className='flex items-center ml-auto font-thin leading-7 text-gray-600 border-b border-gray-300 border-solid'
          >
            查看更多「{note.title}」项目 <Right theme="filled" size="18" fill="#4b5563" strokeWidth={2} />
          </Link>
        </div>

        {note.noteItems.length > 0 ? (
          <div className='flex flex-wrap w-full pb-10 border-b border-gray-100 w-hidden'>
            {note.noteItems.map(item => (
              <NoteItem
                id={item.id}
                key={item.id}
                title={item.title}
                cover={item.cover}
                source={item.strategy.name}
              />
            ))}
          </div>
        ) : (
          <div
            className={`flex items-center justify-center
            w-full border-b border-gray-100 h-48 text-base`}
          >立刻添加新的项目到 「{note.title}」 中。</div>
        )}
      </div >

    );
  };

export default Note;
