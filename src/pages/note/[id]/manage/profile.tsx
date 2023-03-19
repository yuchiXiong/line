import React, { useEffect, useState } from 'react';
import { TNote } from '@/pages/api/notes';
import Input from '@/components/Input';
import NoteManageLayout from './layout';
import { useRouter } from 'next/router';
import services from '@/services';

const NoteManageProfile: React.FC = () => {
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

  return (
    <NoteManageLayout>
      <div className="flex flex-col justify-center min-h-full p-4 ">
        <form method='put'>
          <div className="mt-2">
            <input name="note_item[note_id]" type="hidden" />
            <div className="my-3">
              <Input
                placeholder={note.title}
                name='title'
              />
            </div>
          </div>

          <div className="mt-4">
            <button
              type="submit"
              className={`inline-flex justify-center px-4 py-2 text-sm 
                  font-medium text-blue-900 bg-blue-100 border 
                  border-transparent rounded-md hover:bg-blue-200 
                  focus:outline-none focus-visible:ring-2 
                  focus-visible:ring-blue-500 focus-visible:ring-offset-2`}
            >
              更新
            </button>

          </div>
        </form>

      </div>
    </NoteManageLayout>

  );
};

export default NoteManageProfile;
