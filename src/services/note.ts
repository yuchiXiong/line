import request from './request';
import { TNote } from '@/pages/api/notes';
import { IPagination } from './request';
import { TSearchResult } from '@/pages/api/note-items';

const Note = {
  getNotes(): Promise<{
    notes: TNote[],
    pagination: IPagination
  }> {
    return request.get('/api/notes');
  },
  getNote(id: string): Promise<{
    note: TNote
  }> {
    return request.get(`/api/notes/${id}`);
  },
  createNote(note: Pick<TNote, 'title'>): Promise<{
    note: TNote
  }> {
    return request.post('/api/notes', {
      title: note.title
    });
  },
  // updateNote(note: Pick<TNote, 'title' | 'cover' | 'id'>): Promise<IResponse<INote>> {
  //   return request.put(`/users/${userId}/notes/${note.id}`, {
  //     title: note.title,
  //     cover: note.cover,
  //     id: note.id,
  //     'user_id': userId
  //   });
  // },
  deleteNote(noteId: number): Promise<{}> {
    return request.delete(`/api/notes/${noteId}`);
  },
  getAutoComplete(noteId: number, keyword: string): Promise<{
    noteItems: TSearchResult[]
  }> {
    return request.get(`/api/notes/${noteId}/auto-complete?keyword=${keyword}`);
  },
}

export default Note;