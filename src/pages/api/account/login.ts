// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
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

const handler = baseHandler()
  .post(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ msg: '用户名与密码不能为空。' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (user && bcrypt.compareSync(password, user.password)) {
      const token = jwt.sign({
        uuid: user.uuid,
        email: user.email
      }, process.env.JWT_SECRET as string, { expiresIn: '7d' });

      res.status(200).json({
        user: {
          nickname: user.nickname || '',
          jwt: token,
          email: user.email,
          uuid: user.uuid
        }
      });
    } else {
      res.status(401).json({ msg: '用户名与密码不匹配。' })
    }
  });

export default handler;