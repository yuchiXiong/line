import { useRouter } from 'next/router';
import React from 'react';

const NoteItem: React.FC<{
  id: number,
  title: string,
  cover: string,
  source: string,
}> = ({
  id,
  title,
  cover,
  source
}) => {

    const router = useRouter();

    const { id: noteId } = router.query;

    const goToDetail = () => {
      router.push(`/note/${noteId}/items/${id}`);
    };

    return (
      <div className="box-border w-1/4 h-full overflow-hidden cursor-pointer" onClick={goToDetail}>
        <div className='flex items-center p-6 m-2 bg-gray-100 rounded'>
          <img
            className='w-24 h-32 overflow-hidden rounded'
            referrerPolicy="no-referrer"
            src={cover}
          />
          <div className='flex flex-col flex-1 ml-4'>
            <p className="text-sm text-gray-700 line-clamp-2">{title}</p>
            <span className="px-2 py-1 mt-2 text-xs text-white bg-green-500 rounded w-max">{source}</span>
          </div>
        </div>
      </div >
    );
  };

export default NoteItem;
