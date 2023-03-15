import request from './request';
import { IUser } from '@/pages/api/account/login'

export function login(params: { email: string; password: string }): Promise<{
  user: IUser;
}> {
  return request.post('/api/account/login', params);
}
