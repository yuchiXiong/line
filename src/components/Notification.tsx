import { createRoot } from 'react-dom/client';
import React, { Fragment } from 'react';
import { Transition } from '@headlessui/react';
import { CloseSmall, Info } from '@icon-park/react';

/** 多个 Notification 会位于同一个容器中 */
let root: HTMLDivElement | null = null;
const rootID = Math.random().toString(36).slice(2);

export interface INotificationProps {
  /** 显隐状态 */
  visible: boolean;
  /** 关闭 Notification */
  handleClose: () => void;
  /** 标题 */
  title: string;
  /** 内容 */
  description: string;
  /** 样式类型 */
  type: 'success' | 'info' | 'warn' | 'error';
}

const Notification: React.FC<INotificationProps> = ({
  visible = false,
  handleClose,
  title,
  description,
  type = 'info'
}) => {

  return (
    <Transition appear show={visible} as={Fragment}>
      <div className="max-w-md w-max">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-0 translate-x-full"
          enterTo="opacity-100 scale-100 translate-x-0"
          leave="ease-in duration-300"
          leaveFrom="opacity-100 scale-100 translate-x-0"
          leaveTo="opacity-0 scale-0 translate-x-full"
        >
          <div className="p-6 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl w-96 rounded-2xl">
            <div className='flex items-center w-full'>
              {type === "success" && <Info className='mr-1' theme="filled" size="20" fill="#16a34a" />}
              {type === "info" && <Info className='mr-1 fill-blue-500' theme="filled" size="20" fill="#3b82f6" />}
              {type === "warn" && <Info className='mr-1 fill-yellow-500' theme="filled" size="20" fill="#eab308" />}
              {type === "error" && <Info className='mr-1 fill-red-600' theme="filled" size="20" fill="#dc2626" />}

              <h3 className="flex items-center flex-1 text-lg font-medium leading-6 text-gray-900">
                {title}
                <CloseSmall
                  className='ml-auto cursor-pointer'
                  theme="outline"
                  size="20"
                  fill="#000000"
                  onClick={handleClose}
                />
              </h3>
            </div>
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                {description}
              </p>
            </div>
          </div>
        </Transition.Child>
      </div>
    </Transition>
  )
}

interface IStaticeMethodsArgs {
  title: string;
  description: string;
  duration?: number;
  type?: 'success' | 'info' | 'warn' | 'error';
}

/** 通用的调起 Notice 通知的方法 */
const open = (options: IStaticeMethodsArgs) => {
  const { title, description, duration = 3, type = 'info' } = options;

  if (!root) {
    root = document.createElement('div');
    root.id = rootID;
    root.className = 'fixed z-50 flex flex-col top-1 right-2'
    document.body.appendChild(root);
  }

  const container = document.createElement('div');
  container.className = 'mt-2 w-max h-max';
  root.appendChild(container);

  const node = createRoot(container);

  /** 先让节点渲染离场，然后删除节点 */
  const close = () => {
    node.render(
      <Notification
        visible={false}
        handleClose={close}
        title={title}
        description={description}
        type={type}
      />
    );

    setTimeout(() => {
      node.unmount();
      root!.removeChild(container);
    }, 300)
    clearTimeout(timer as NodeJS.Timeout);
  };

  node.render(<Notification
    visible={true}
    handleClose={close}
    title={title}
    description={description}
    type={type}
  />);

  let timer: NodeJS.Timeout | null = null;
  if (duration) {
    timer = setTimeout(close, duration * 1000);
  }
}

/** type success */
const success = (options: IStaticeMethodsArgs) => {
  open({ ...options, type: 'success' });
};

/** type info */
const info = (options: IStaticeMethodsArgs) => {
  open({ ...options, type: 'info' });
};

/** type warn */
const warn = (options: IStaticeMethodsArgs) => {
  open({ ...options, type: 'warn' });
};

/** type error */
const error = (options: IStaticeMethodsArgs) => {
  open({ ...options, type: 'error' });
};

const staticMethods = {
  info,
  success,
  warn,
  error,
};


export default staticMethods;
