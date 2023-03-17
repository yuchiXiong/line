import request from './request';
import { TNote } from '@/pages/api/notes';
import { IPagination } from './request';
import { Note } from '@prisma/client';

const Note = {
  getNotes(): Promise<{
    notes: TNote[],
    pagination: IPagination
  }> {
    return request.get('/api/notes');
  },
  // getNote(id: string): Promise<IResponse<INote>> {
  //   return request.get(`/users/${userId}/notes/${id}`);
  // },
  createNote(note: Pick<Note, 'title'>): Promise<{
    note: TNote
  }> {
    return request.post('/api/notes', {
      title: note.title
    });
  },
  // updateNote(note: Pick<INote, 'title' | 'cover' | 'id'>): Promise<IResponse<INote>> {
  //   return request.put(`/users/${userId}/notes/${note.id}`, {
  //     title: note.title,
  //     cover: note.cover,
  //     id: note.id,
  //     'user_id': userId
  //   });
  // },
  // deleteNote(noteId: number): Promise<IResponse<INote>> {
  //   return request.delete(`/users/${userId}/notes/${noteId}`);
  // }
}

export default Note;