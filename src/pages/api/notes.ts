// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import authMiddleware from './middleware/auth';
import baseHandler from './base';

const handler = baseHandler.get(authMiddleware, (req, res) => {
  const { currentUser } = req;
  res.send({ user: currentUser });
});

export default handler;