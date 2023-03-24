import { PrismaClient, Prisma, User } from '@prisma/client';

/** 开发环境下每次触发热更新都会重复创建与添加中间件，所以需要在全局缓存 */
const createPrismaClient = () => {
  const prisma = new PrismaClient({
    log: ['query'],
  });

  // 添加统一的处理，针对 Note/NoteItem/Strategy 的添加/修改/软删除操作，记录到 Audit 表中
  prisma.$use(async (params: Prisma.MiddlewareParams, next) => {
    const result = await next(params);

    if (params.model === 'Note' || params.model === 'NoteItem' || params.model === 'Strategy') {
      const { action, args } = params;
      const { data } = args;

      if (action === 'create' || action === 'update') {
        const userId = data.user.connect.id;

        await prisma.audit.create({
          data: {
            auditableId: result.id,
            auditableType: params.model,
            action,
            auditedChanges: JSON.stringify(result),
            user: {
              connect: {
                id: userId
              }
            }
          },
        });
      }
    }

    return result;
  });

  return prisma;
};

export const prisma =
  // @ts-expect-error
  global.prisma as PrismaClient<{
    log: "query"[];
  }, never, false> || createPrismaClient();




// @ts-expect-error
if (process.env.NODE_ENV === 'development') global.prisma = prisma;

