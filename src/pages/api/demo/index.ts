// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import baseHandler from '../base';
import puppeteer from 'puppeteer';

const prisma = new PrismaClient();


const handler = baseHandler()
  .get(async (req, res) => {

    // Launch the browser and open a new blank page
    const browser = await puppeteer.launch();
    const page = await browser.newPage();


    // enable request interception
    await page.setRequestInterception(true);

    // add header for the navigation requests
    page.on('request', request => {
      const headers = request.headers();
      headers['Authorization'] = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiNmVjNTM5MzktM2MwMi00MGYyLTg4Y2MtMTFlNjZiMDBiMGZmIiwiZW1haWwiOiJ5dWNoaS54aW9uZ0Bmb3htYWlsLmNvbSIsImlhdCI6MTcwMjQ3MzgwMywiZXhwIjoxNzAzMDc4NjAzfQ.oUvjB0uMC8knGLu8Z4FruX_Rt6Me1_yZcIz5ywOcMds";
      request.continue({ headers });
    });

    // Navigate the page to a URL
    await page.goto('http://localhost:3000/profile-preview', {
      waitUntil: 'networkidle0',
    });

    // Set screen size
    await page.setViewport({ width: 640, height: 1024 });


    const img = await page.screenshot({
      fullPage: true,
    });


    await browser.close();

    res
      .status(200)
      .setHeader('Content-Disposition', `inline; filename="1.jpg"`)
      .setHeader('Content-Type', 'image/jpeg')
      .send(img);

    res.status(200).json({
      msg: 'sss'
    });
  });

export default handler;