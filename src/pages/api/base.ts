import type { NextApiRequest, NextApiResponse } from 'next';
import nc, { Options } from "next-connect";

const baseHandler = (opt?: Options<NextApiRequest, NextApiResponse<any>>) => nc<NextApiRequest, NextApiResponse>({
  attachParams: opt?.attachParams,
  onError: (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ msg: "Internal server error" });
  },
  onNoMatch: (req, res) => {
    res.status(404).json({ msg: "Page is not found -- --" });
  },
})

export default baseHandler;