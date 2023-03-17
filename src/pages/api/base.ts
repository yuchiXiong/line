import type { NextApiRequest, NextApiResponse } from 'next';
import nc from "next-connect";

const baseHandler = () => nc<NextApiRequest, NextApiResponse>({
  onError: (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ msg: "Internal server error" });
  },
  onNoMatch: (req, res) => {
    res.status(404).json({ msg: "Page is not found -- --" });
  },
})

export default baseHandler;