import React, { useEffect, useState } from 'react';
import NoteItem from '../../home/components/note-item';
import Button from '@/components/Button';
import { TNote } from '@/pages/api/notes';
import { TNoteItem } from '@/pages/api/note-items';
import CreateNoteItemForm from '../components/create-note-item-form';
import Layout from './layout';
import services from '@/services';
import { useRouter } from 'next/router';


const NoteItemList: React.FC<{}> = () => {

  const { id } = useRouter().query as { id: string };
  const [visible, setVisible] = useState<boolean>(false);
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

    fetchNoteItems();
  }, [id]);

  const fetchNoteItems = () => {
    services.getNote(id).then(res => {
      setNote(res.note);
    }, () => { });
  };

  const dataSource: TNoteItem[] = note.noteItems || [];

  return (
    <Layout>
      <CreateNoteItemForm
        note={note}
        visible={visible}
        handleClose={() => setVisible(false)}
        afterCreate={fetchNoteItems}
      />

      <div className='flex items-center w-4/5 mx-auto'>
        <span>当前共 {note.itemTotal} 个项目</span>
        <Button
          onClick={() => setVisible(true)}
          className={`px-4 py-2 ml-auto text-sm font-medium
             text-white bg-green-600 rounded-md mb-4`}
        >
          添加项目
        </Button>
      </div>
      <section className='w-4/5 mx-auto my-1'>

        <div className='flex flex-wrap'>
          {dataSource.map(item => (
            <NoteItem
              id={item.id}
              title={item.title}
              key={item.id}
              cover={item.cover}
              source={item.strategy.name}
            />
          ))}
        </div>
      </section>
    </Layout>

  );
};

export default NoteItemList;
