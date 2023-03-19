import React, { useEffect, useState } from 'react';
import { TNote } from '@/pages/api/notes';
import Services from '@/services';
import NoteManageLayout from './layout';
import { useRouter } from 'next/router';
import services from '@/services';

const NoteManageSecurity = () => {

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

    services.getNote(id).then(res => {
      setNote(res.note);
    }, () => { });
  }, [id]);

  const handleDelete = () => {
    // todo Dialog.confirm
    if (confirm('xxx')) {
      Services.deleteNote(note.id).then(res => {
        router.push('/');
      });
    }
  };

  return (
    <NoteManageLayout>
      <h2 className="mb-1 text-xl font-medium text-red-600 title-font">⚠️注意：</h2>
      <p className="mt-2 mb-6 leading-relaxed text-gray-600">该空间下的操作会对您的 Note 造成一定的影响，请谨慎操作。</p>

      <section className="text-gray-600 border border-orange-300 rounded-md body-font">
        {[{
          title: '归档这个 Note ',
          desc: '将这个 Note 标记为归档和只读',
          actionText: `归档「${note.title}」`,
          action: () => { }
        }, {
          title: '删除这个 Note ',
          desc: '该操作是不可逆的，一旦确认将没有回头路。',
          actionText: `删除「${note.title}」`,
          action: handleDelete
        }].map((i, index) => (
          <div key={i.title} className={`flex items-center p-4 border-gray-200 ${index !== 1 && 'border-b'}`}>
            <div className="flex flex-col">
              <h2 className="font-medium text-gray-900 text-md title-font">{i.title}</h2>
              <p className="text-sm leading-relaxed">{i.desc}</p>
            </div>
            <button
              onClick={i.action}
              className={`px-5 h-9 ml-auto font-medium text-red-600 
          bg-gray-50 border border-gray-300 rounded-md`}>{i.actionText}</button>
          </div>
        ))}
      </section>
    </NoteManageLayout>
  );
};

export default NoteManageSecurity;
