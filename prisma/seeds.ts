// prisma/seeds.ts

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
  // create two dummy articles
  const user = await prisma.user.create({
    data: {
      nickname: 'yuchi',
      email: 'yuchi.xiong@foxmail.com',
      password: bcrypt.hashSync('123456', 10),
    }
  });
  console.log(user)
}

// execute the main function
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // close Prisma Client at the end
    await prisma.$disconnect();
  });