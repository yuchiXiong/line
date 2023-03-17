import type { NextApiRequest, NextApiResponse } from 'next';
import { NextHandler } from "next-connect";
import jwt from 'jsonwebtoken';
import { PrismaClient, User } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * @description 验证用户是否登录，
 */
const authMiddleware = async (req: NextApiRequest & { currentUser: User }, res: NextApiResponse, next: NextHandler) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ message: "请先登录。" });
  }

  try {
    const { uuid } = jwt.verify(
      authorization.slice(7, authorization.length),
      process.env.JWT_SECRET as string
    ) as { uuid: string, email: string };

    const user = await prisma.user.findUnique({
      where: {
        uuid
      }
    });

    if (!user) {
      return res.status(401).json({ message: "登录失效，请尝试重新登陆。" });
    }

    req.currentUser = user;

    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "登录失效，请尝试重新登陆。" });
  }
}

export default authMiddleware;