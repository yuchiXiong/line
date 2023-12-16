import request from './request';
import { TNoteItem } from '@/pages/api/note-items';

const NoteItem = {
  createNoteItem({ noteId, noteItem }: {
    noteId: number,
    noteItem: { title: string, cover: string, strategy: { id: number, name: string } }
  }): Promise<{
    noteItem: TNoteItem
  }> {
    return request.post(`/api/note-items`, { noteId, noteItem });
  },
};

export default NoteItem;
