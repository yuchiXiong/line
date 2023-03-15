// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export interface IUser {
  nickname: string;
  jwt: string;
  email: string;
  uuid: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IUser | { msg: string }>
) {
  if (req.method !== 'POST') {
    return res.status(404).end();
  }

  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: {
      email: email,
    }
  });

  if (user && bcrypt.compareSync(password, user.password)) {
    res.status(200).json({
      nickname: user.nickname || '',
      jwt: '',
      email: user.email,
      uuid: ''
    });
  } else {
    res.status(401).json({ msg: '用户名与密码不匹配' })
  }

}
