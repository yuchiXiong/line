import React, { useState } from 'react';
import Services from '@/services';
import Input from '@/components/Input';
import Dialog from '@/components/Dialog';
import Button from '@/components/Button';
import { Note } from '@prisma/client';

const CreateNoteFrom: React.FC<{
  visible: boolean,
  handleClose: () => void
  afterSubmit: () => void
}> = ({
  visible,
  handleClose,
  afterSubmit
}) => {
    const [note, setNote] = useState<Pick<Note, 'title'>>({
      title: '',
    });

    const handleNoteItemCreate = () => {
      Services.createNote(note).then(res => {
        handleClose();
        afterSubmit();
        setNote({
          title: '',
        })
      }, () => { });
    };

    return (
      <Dialog
        visible={visible}
        onClose={handleClose}
        title='创建 Note'
        actions={[
          <Button
            type="button"
            className='ml-0 text-blue-900 bg-blue-100'
            onClick={handleNoteItemCreate}
            key='create'
          >
            创 建
          </Button>,
          <Button
            type="button"
            className='text-gray-900 bg-blue-100'
            onClick={handleClose}
            key='cancel'
          >
            取 消
          </Button>
        ]}
      >
        <input name="note_item[user_id]" type="hidden" />
        <input name="note_item[note_id]" type="hidden" />
        <div className="my-3">
          <Input
            placeholder='标题'
            value={note.title}
            onChange={event => setNote({ ...note, title: event.target.value })}
          />
        </div>
      </Dialog>
    );
  };

export default CreateNoteFrom;
