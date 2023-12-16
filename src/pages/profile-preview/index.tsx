import React, { useState } from 'react';
import Services from '@/services';
import Button from '@/components/Button';
import useSWR, { mutate } from 'swr';
import dayjs from '@/utils/dayjs';

export default function HomePage() {

  const { data, error, isLoading } = useSWR('/api/notes', Services.getNotes)

  const notes = data?.notes || [];

  return (
    <div
      className="container flex flex-col px-4 pb-8 mx-auto tracking-widest text-white h-max"
      style={{
        backgroundColor: 'rgb(126, 176, 154)'
      }}
    >
      {notes.filter(note => note.noteItems.length > 0).map(note => (
        <div key={note.id} className='my-4'>
          <p className='mb-2 text-2xl font-semibold '>「{note.title} 」</p>
          <ul className='ml-4'>
            {note.noteItems.map(item => (
              <li
                key={item.id}
                className='flex flex-row items-center w-max'
              >
                <span className='inline-block w-1.5 h-1.5 mr-2 bg-white rounded-full' />
                <a href='#' className='text-white'>{item.title}</a>&nbsp;-&nbsp;{dayjs(note?.createdAt).format('YYYY-MM-DD')}
              </li>
            ))}
          </ul>
        </div>
      ))}
      <div className='flex flex-row justify-center mt-4'>
        <div className='flex flex-col items-center justify-center ml-auto text-xl tracking-wide'>
          {
            // todo 需要把用户信息替换进来
            // todo 这里可以写自定义域名
          }
          <span className='text-xl'>@yuchiXiong</span>
          <span className="right-0 ml-auto text-xs">by line.bubuyu.top</span>
        </div>
        <img
          src="https://avatars.githubusercontent.com/u/48373109?v=4"
          alt='avatar'
          className='w-12 h-12 ml-2 rounded-full'
        />
      </div>
    </div >

  );
}
