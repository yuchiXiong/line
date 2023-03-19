import React, { useEffect, useState } from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import dayjs from '@/utils/dayjs';
import Link from 'next/link';
import 'react-calendar-heatmap/dist/styles.css';
import { IActivity, TNote } from '@/pages/api/notes';
import Layout from './layout';
import { useRouter } from 'next/router';
import services from '@/services';

const COLOR_THEME: '-halloween' | '-winter' | '' = '';

const getColor = (count: number) => {
  switch (true) {
    case count === 0:
      return 'color-empty';
    case count >= 1 && count <= 3:
      return `calendar${COLOR_THEME}-graph-day-L1-bg`;
    case count >= 4 && count <= 7:
      return `calendar${COLOR_THEME}-graph-day-L2-bg`;
    case count >= 8 && count <= 11:
      return `calendar${COLOR_THEME}-graph-day-L3-bg`;
    default:
      return `calendar${COLOR_THEME}-graph-day-L4-bg`;
  };
};

const ACTION_MAP = {
  'create': '创建',
  'update': '更新',
  'delete': '删除'
};

const Overview: React.FC = () => {

  const { id } = useRouter().query as { id: string };
  const [dataSource, setDataSource] = useState<IActivity[]>([]);

  useEffect(() => {
    services.getNote(id).then(res => {
      setDataSource(res.note.activities);
    }, () => { });
  }, [id]);

  const transfer = (data: IActivity[]): { date: string, count: number }[] => {
    return data.map(i => {
      const curDate = dayjs(i.createdAt).format('YYYY-MM-DD');

      return {
        date: curDate,
        count: data.filter(i => dayjs(i.createdAt).format('YYYY-MM-DD') === curDate).length
      };
    });
  };

  return (
    <Layout>
      <div className='w-3/5 mx-auto'>
        <CalendarHeatmap
          gutterSize={4}
          titleForValue={value => value ? dayjs(value.date).format('YYYY-MM-DD') : ''}
          startDate={dayjs().subtract(1, 'year').format('YYYY-MM-DD')}
          endDate={dayjs().format('YYYY-MM-DD')}
          classForValue={value => getColor(value?.count || 0)}
          values={transfer(dataSource)}
        />
      </div>

      <section className="flex flex-col w-3/5 py-16 mx-auto text-gray-600 body-font ">
        {dataSource.map(i => (
          <div key={i.id} className="relative flex w-full pb-12">
            {(i.auditableType !== 'Note' || i.action !== 'create') && (
              <div className="absolute inset-0 flex items-center justify-center w-5 h-full">
                <div className="w-1 h-full bg-gray-200 pointer-events-none" />
              </div>
            )}
            <div
              className={`relative z-10 inline-flex items-center justify-center 
                    flex-shrink-0 w-5 h-5 text-white bg-indigo-500 rounded-full`}
            >
              <svg
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="w-3 h-3"
                viewBox="0 0 24 24"
              >
                {(i.auditableType !== 'Note' || i.action !== 'create') ? (
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                ) : (
                  <>
                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                    <path d="M22 4L12 14.01l-3-3" />
                  </>
                )}
              </svg>
            </div>
            <div className="flex-grow pl-4 ml-3">
              <h2 className="mb-1 text-sm font-medium tracking-wider text-gray-900 title-font">
                {i.auditableType === 'NoteItem' ? '条目' : '类别'}操作
              </h2>
              <p className="flex leading-relaxed">
                {ACTION_MAP[i.action]}了{i.auditableType === 'NoteItem' ? '条目' : '类别'}&nbsp;
                <Link
                  href={'/notes/3'}
                  className='border-b border-gray-400 border-solid hover:text-blue-700 hover:border-blue-600'
                >{i.auditedChanges.title}</Link>
                <span title={dayjs(i.createdAt).format('YYYY-MM-DD')} className="ml-auto text-sm text-gray-400">
                  {dayjs(i.createdAt).fromNow()}
                </span>
              </p>
            </div>
          </div>
        ))}
      </section>
    </Layout>
  );
};

export default Overview;
