import React from 'react';

export interface IInputProps {
  value?: string,
  placeholder?: string,
  className?: string,
  type?: 'text' | 'hidden'
  name?: string
  id?: string,
  autoComplete?: 'on' | 'off',
  onChange?: React.ChangeEventHandler<HTMLInputElement>
}

const Input: React.FC<IInputProps> = ({
  id = '',
  value = undefined,
  placeholder = '',
  className = '',
  type = 'text',
  name = '',
  autoComplete = 'off',
  onChange = undefined
}) => {

  return (
    <input
      id={id}
      name={name}
      type={type}
      className={[
        'block w-full px-2 py-2 mt-2 border border-gray-200 rounded-md shadow outline-none',
        className
      ].join('')}
      autoComplete={autoComplete}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
};


export default Input;
