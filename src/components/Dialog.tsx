import React, { Fragment } from 'react';
import { Dialog as HeadlessDialog, Transition } from '@headlessui/react';

interface IDialogProps {
  visible: boolean,
  onClose: () => void,
  title?: React.ReactElement | string,
  children?: React.ReactElement | React.ReactElement[],
  actions?: React.ReactElement[]
}

const Dialog: React.FC<IDialogProps> = ({
  visible,
  onClose,
  title,
  children,
  actions
}) => {
  return (
    <Transition appear show={visible} as={Fragment}>
      <HeadlessDialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-full p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <HeadlessDialog.Panel
                className="w-full max-w-md p-6 text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl"
              >
                {title && (
                  <HeadlessDialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >{title}</HeadlessDialog.Title>
                )}

                <div className="mt-2">
                  {children}
                </div>

                {actions && (
                  <div className="mt-4">{actions}</div>
                )}
              </HeadlessDialog.Panel>
            </Transition.Child>
          </div>
        </div >
      </HeadlessDialog >
    </Transition >
  );
};

export default Dialog;
