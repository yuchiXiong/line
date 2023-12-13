import React, {useEffect, useState} from 'react';
import Services from '@/services';
import Button from '@/components/Button';
import Note from './components/note';
import {TNote} from '@/pages/api/notes';
import CreateNoteFrom from './components/create-note-form';

export default function HomePage() {

  const [notes, setNotes] = useState<TNote[]>([]);
  const [createNoteFormVisible, setCreateNoteFormVisible] = useState<boolean>(false);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = () => {
    Services.getNotes().then(res => {
      setNotes(res.notes);
    }, () => { });
  };

  const openAddNoteModal = () => {
    setCreateNoteFormVisible(true);
  };

  return (
    <div className="flex flex-col w-full h-screen pt-24">

      <CreateNoteFrom
        visible={createNoteFormVisible}
        handleClose={() => setCreateNoteFormVisible(false)}
        afterSubmit={() => fetchNotes()}
      />

      <section className="box-border fixed w-full top-0 z-10 p-6 text-center bg-gray-100">
        <p className="text-base leading-relaxed text-gray-600">
          <Button onClick={openAddNoteModal} className="">创建 Note</Button> 记录每一件美好的事物。
        </p>
      </section>

      {notes.length > 0 && (
        <div className="flex-1 text-gray-600 body-font">
          <div className="px-4 mx-auto">
            <div className="flex flex-col w-8/12 mx-auto">
              {notes.map(note => (
                <Note
                  key={note.id}
                  note={note}
                />
              ))}
            </div>
          </div>
        </div>
      )}

    </div >

  );
}
