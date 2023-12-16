import React, { useRef, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import Button from '@components/Button';
import useClickAway from '@hooks/useClickAway';
import { INote, IStrategy } from '@services/note';

const StrategyManage: React.FC<{
}> = ({
}) => {
    const dataSource: IStrategy[] = (useOutletContext() as INote).strategies || [];

    const [addStrategyVisible, setAddStrategyVisible] = useState<boolean>(false);
    const addColRef = useRef<HTMLTableRowElement>(null);
    const addStrategyButtonRef = useRef<HTMLButtonElement>(null);

    const handleAdd = () => {
      setAddStrategyVisible(true);
    };

    useClickAway(addColRef.current as HTMLTableRowElement, (e: Event) => {
      if (!addStrategyVisible && e.target !== addStrategyButtonRef.current) {
        setAddStrategyVisible(false);
      }
    });

    return (
      <section className="text-gray-600 body-font">
        <div className="container px-5 py-5 mx-auto">

          {/* <div className="flex flex-col w-full mb-20 text-center">
            <h1 className="mb-2 text-3xl font-medium text-gray-900 sm:text-4xl title-font">Pricing</h1>
            <p className="mx-auto text-base leading-relaxed lg:w-2/3">
              mi echo park skateboard authentic crucifix
              tilde lyft artisan direct trade 3 wolf moon twee
            </p>
          </div> */}

          <div className='flex items-center'>
            <span>当前共 {dataSource.length} 条策略</span>
            <Button
              onClick={handleAdd}
              ref={addStrategyButtonRef}
              className={`px-4 py-2 ml-auto text-sm font-medium
             text-white bg-green-600 rounded-md mb-4`}
            >
              添加策略
            </Button>
          </div>

          <div className="w-full mt-4 overflow-auto">
            <table className="w-full text-center table-auto">
              <thead>
                <tr>
                  {['策略名', '抓取地址', '抓取指标', '抓取模式'].map(i => (
                    <th
                      key={i}
                      className="w-1/5 px-4 py-3 text-sm font-medium tracking-wider text-gray-900 bg-gray-100 title-font"
                    >
                      {i}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dataSource.map(i => (
                  <tr key={i.id}>
                    <td className="w-1/5 px-4 py-3 border-b border-gray-200">{i.name}</td>
                    <td className="w-1/5 px-4 py-3 border-b border-gray-200">
                      <span className='px-2 py-1 text-sm text-red-400 bg-gray-200 rounded line-clamp-1'>{i.source}</span>
                    </td>
                    <td className="w-1/5 px-4 py-3 border-b border-gray-200">
                      {Object.keys(i.attrSelector).map(key => (
                        <span key={key} className="inline-block px-2 mr-1 text-sm bg-gray-200 rounded ">{key}</span>
                      ))}
                    </td>
                    <td className="w-1/5 px-4 py-3 border-b border-gray-200">
                      <span className="inline-block px-2 mr-1 text-sm bg-gray-200 rounded ">{i.mode}</span>
                    </td>
                  </tr>
                ))}

                <tr ref={addColRef} className={`${!addStrategyVisible ? 'hidden' : 'table-row'}`}>

                  <td className="w-1/5 px-4 py-3 border-b border-gray-200">
                    <input
                      type="text"
                      id="full-name"
                      name="full-name"
                      className={`w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 
                      focus:border-indigo-500 focus:bg-transparent 
                      focus:ring-2 focus:ring-indigo-200 text-base outline-none
                       text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out`}
                    />
                  </td>
                  <td className="w-1/5 px-4 py-3 border-b border-gray-200">
                    <input
                      type="text"
                      id="full-name"
                      name="full-name"
                      className={`w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 
                      focus:border-indigo-500 focus:bg-transparent 
                      focus:ring-2 focus:ring-indigo-200 text-base outline-none
                       text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out`}
                    />
                  </td>
                  <td className="w-1/5 px-4 py-3 border-b border-gray-200">
                    <input
                      type="text"
                      id="full-name"
                      name="full-name"
                      className={`w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 
                      focus:border-indigo-500 focus:bg-transparent 
                      focus:ring-2 focus:ring-indigo-200 text-base outline-none
                       text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out`}
                    />
                  </td>
                  <td className="w-1/5 px-4 py-3 border-b border-gray-200">
                    <input
                      type="text"
                      id="full-name"
                      name="full-name"
                      className={`w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 
                      focus:border-indigo-500 focus:bg-transparent 
                      focus:ring-2 focus:ring-indigo-200 text-base outline-none
                       text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out`}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="flex w-full pl-4 mx-auto mt-6">
            <a className="inline-flex items-center ml-auto text-indigo-500 md:mb-2 lg:mb-0">了解更多
              <svg
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="w-4 h-4 ml-2"
                viewBox="0 0 24 24"
              >
                <path d="M5 12h14M12 5l7 7-7 7"></path>
              </svg>
            </a>

          </div>
        </div>
      </section>
    );
  };

export default StrategyManage;
