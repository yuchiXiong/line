import React, { FormEvent, useEffect, useState } from 'react';
import { TNote } from '@/pages/api/notes';
import Input from '@/components/Input';
import NoteManageLayout from './layout';
import { Router, useRouter } from 'next/router';
import Services from '@/services';

const NoteManageProfile: React.FC = () => {
  const router = useRouter();
  const { id } = router.query as { id: string };
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
    if (!id) return;

    fetchData();
  }, [id]);

  const fetchData = () => {
    Services.getNote(id).then(res => {
      setNote({ ...res.note });
    }, () => { });
  }

  const handleUpdateNote = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const title = e.currentTarget.noteTitle.value;
    Services.updateNote({
      id: Number(id),
      title,
    }).then(res => {
      // todo refresh
      location.reload();
    }, () => { });
  }

  return (
    <NoteManageLayout>
      <div className="flex flex-col justify-center min-h-full p-4 ">
        <form method='put' onSubmit={handleUpdateNote}>
          <div className="mt-2">
            <input name="note_item[note_id]" type="hidden" />
            <div className="my-3">
              <Input
                placeholder={note.title}
                name='noteTitle'
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
