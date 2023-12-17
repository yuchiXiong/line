import React, { useState, useEffect, Fragment, useRef, useCallback, useMemo } from 'react';
import { Combobox, Transition } from '@headlessui/react';
import { debounce } from 'lodash';
import Services from '@/services';
import { TNote } from '@/pages/api/notes';
import { TSearchResult } from '@/pages/api/note-items';
import Input from '@/components/Input';
import Button from '@/components/Button';
import Dialog from '@/components/Dialog';

/**
 * @yuchiXiong
 * @description  创建 NoteItem 弹窗表单组件
 */
const CreateNoteItemForm: React.FC<{
  /** NoteItem 所属的 Note 对象信息 */
  note: TNote,
  /** 表单弹窗显隐状态 */
  visible: boolean,
  /** 关闭弹窗 */
  handleClose: () => void,
  /** 创建成功后的回调函数 */
  afterCreate?: () => void
}> = ({
  note = {
    title: '',
    id: 0,
    userId: 0,
    createdAt: '',
    itemTotal: 0,
    noteItems: [],
    activities: [],
    strategies: [],
  },
  visible = false,
  handleClose,
  afterCreate
}) => {
    const [query, setQuery] = useState<string>('');
    const [recommendNotes, setRecommendNotes] = useState<TSearchResult[]>([]);
    const [currentSelect, setCurrentSelect] = useState<null | TSearchResult>(null);
    const autoCompleteIptRef = useRef<HTMLInputElement>(null);

    /** 查询服务 */
    const autoComplete = useMemo(() => debounce(() => {
      const keyword = autoCompleteIptRef.current?.value;
      if (!keyword) return;

      Services.getAutoComplete(note.id, keyword).then(res => {
        setRecommendNotes([...res.noteItems]);
      });
    }, 300), [note]);

    useEffect(() => {
      if (query.trim().length === 0) {
        setRecommendNotes([]);
        return;
      }
      autoComplete();
    }, [query, autoComplete]);

    const handleSelect = (result: TSearchResult) => {
      setCurrentSelect({ ...currentSelect, ...result });
    };

    /** 创建 NoteItem */
    const handleNoteItemCreate = () => {
      if (!currentSelect?.cover || !currentSelect?.title) {
        // todo 后面调整为用 form 表单，接口上最好也加上校验
        alert('请填写标题和封面(style: todo)');
        return;
      }

      if (!currentSelect?.cover?.includes('http')) {
        // todo 后面调整为用 form 表单，接口上最好也加上校验
        alert('请填写合法的封面地址(style: todo)');
        return;
      }

      const noteItem = {
        title: currentSelect?.title || '',
        cover: currentSelect?.cover || '',
        strategy: currentSelect?.strategy || {
          id: 0,
          name: '手动添加'
        }
      };

      Services.createNoteItem({
        noteId: note.id,
        noteItem
      }).then(() => {
        setRecommendNotes([]);
        setCurrentSelect(null);
        handleClose();
        afterCreate && afterCreate();
      }, () => { });

    };

    return (
      <Dialog
        title={`添加项目到「${note.title}」`}
        visible={visible}
        onClose={handleClose}
        actions={[
          <Button
            type="button"
            className='ml-0 text-blue-900 bg-blue-100'
            onClick={handleNoteItemCreate}
            key='create'
          >
            创建
          </Button>,
          <Button
            type="button"
            className='text-gray-900 bg-blue-100'
            onClick={handleClose}
            key='cancel'
          >
            取消
          </Button>
        ]}
      >
        <div className="my-3">
          <Combobox onChange={handleSelect}>
            <div className="relative mt-1">

              <Combobox.Input
                ref={autoCompleteIptRef}
                name='title'
                className='block w-full px-3 py-2 mt-2 border border-gray-200 rounded-md shadow outline-none'
                placeholder='标题'
                autoComplete='off'
                value={currentSelect?.title}
                onChange={event => {
                  console.log(event);
                  setQuery(event.target.value);
                  setCurrentSelect({ ...currentSelect as TSearchResult, title: event.target.value, cover: '' });
                }}
              />

              <Transition
                show={query.length !== 0}
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Combobox.Options
                  className={`absolute w-full py-1 mt-1 overflow-auto text-base
                           bg-white rounded-md shadow-lg max-h-60 
                           ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm`}
                >

                  {query.trim().length !== 0 && (
                    <Combobox.Option
                      className={({ active }) =>
                        `relative cursor-default select-none py-2 px-4 border-b border-gray-200
                          ${active ? 'bg-teal-600 text-white' : 'text-gray-900'
                        }`
                      }
                      value={{ title: query }}
                    >
                      创建 &quot;{query}&ldquo;
                    </Combobox.Option>
                  )}

                  {
                    recommendNotes.map((item, index) => (
                      <Combobox.Option
                        key={`${item.title}__${index}`}
                        value={item}
                        className={({ active }) => `relative cursor-default select-none 
                            py-2 px-4 ${active ? 'bg-teal-600 text-white' : 'text-gray-900'
                          }`
                        }
                      >
                        <span className='flex items-center'>
                          <img referrerPolicy='no-referrer' src={item.cover} className="inline w-8 mr-2" />
                          <span className="inline-flex flex-col">
                            <span>{item.title}</span>
                            <span className='mt-1'>数据来源：{item.strategy.name}</span>
                          </span>
                        </span>
                      </Combobox.Option>
                    ))
                  }
                </Combobox.Options>
              </Transition>
            </div>
          </Combobox>
        </div >
        <div className="my-3">
          <Input
            name="cover"
            type="url"
            placeholder="封面"
            value={currentSelect?.cover}
            onChange={event => setCurrentSelect({ ...currentSelect as TSearchResult, cover: event.target.value })}
          />
        </div>

      </Dialog >
    );
  };

export default CreateNoteItemForm;
