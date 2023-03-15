// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import baseHandler from '../base';

const prisma = new PrismaClient();

export interface IUser {
  nickname: string;
  jwt: string;
  email: string;
  uuid: string;
}

const handler = baseHandler
  .post(async (req, res: NextApiResponse<{ user: IUser } | { msg: string }>) => {
    const { email, nickname, password, confirmPassword } = req.body;
    if (!email || !password || !confirmPassword) {
      res.status(403).json({ msg: '参数异常' });
      return;
    }

    if (password !== confirmPassword) {
      res.status(403).json({ msg: '两次密码不一致' });
      return;
    }

    if (await prisma.user.findUnique({ where: { email } })) {
      res.status(403).json({ msg: '该邮箱已被注册' });
      return;
    }

    try {
      const user = await prisma.user.create({
        data: {
          email,
          password: bcrypt.hashSync(password, 10),
          nickname
        }
      });

      const token = jwt.sign({
        uuid: user.uuid,
        email: user.email
      }, process.env.JWT_SECRET as string, { expiresIn: '7d' });

      res.status(200).json({
        user: {
          email,
          nickname: nickname || '',
          uuid: user.uuid,
          jwt: token
        }
      });
    } catch (e) {
      console.log(e)
      res.status(403).json({ msg: '注册失败' })
    }

  });

export default handler;