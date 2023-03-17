// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import authMiddleware from './middleware/auth';
import baseHandler from './base';

export interface IStrategy {
  id: number,
  name: string,
  mode: 'DOM' | 'API',
  source: string,
  attrSelector: Record<string, string>
}

const handler = baseHandler().get(authMiddleware, (req, res) => {
  const { currentUser } = req;
  res.send({ user: currentUser });
});

export default handler;