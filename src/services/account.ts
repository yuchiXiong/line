import request from './request';
import { IUser } from '@/pages/api/account/login'

const User = {
  login(params: { email: string; password: string }): Promise<{
    user: IUser;
  }> {
    return request.post('/api/account/login', params);
  },
  signIn(params: {
    email: string;
    nickname: string;
    password: string;
    confirmPassword: string
  }): Promise<{
    user: IUser
  }> {
    return request.post('/api/account/sign-in', params);
  }

}

export default User;