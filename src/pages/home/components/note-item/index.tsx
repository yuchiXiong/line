import React from 'react';
import {useRouter} from 'next/router';

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

  const {id: noteId} = router.query;

  const goToDetail = () => {
    router.push(`/note/${noteId}/items/${id}`);
  };

  return (
    <div className="box-border inline-block h-96 cursor-pointer w-1/6 p-2 transition-all duration-200 ease-in-out"
         onClick={goToDetail}>
      <div
        className='flex relative h-full w-full items-center bg-gray-100 overflow-hidden rounded'
      >
        <img
          alt="cover"
          className='flex-1 w-full absolute top-0 left-0 rounded transition duration-200 ease-in-out hover:scale-150'
          referrerPolicy="no-referrer"
          src={cover}
        />
        <div
          className='absolute flex text-xl items-center justify-end bottom-0 h-12 w-full bg-gradient-to-t from-black via-90% to-transparent text-md text-right px-2 text-white '
        >
          <span className="line-clamp-1 w-full">{title}</span>
          {/*<span className="px-2 py-1 mt-2 text-xs text-white bg-green-500 rounded w-max">{source}</span>*/}
        </div>
      </div>
    </div>
  );
};

export default NoteItem;
