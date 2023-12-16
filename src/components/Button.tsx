import React, { forwardRef } from 'react';

interface IButtonProps {
  children: React.ReactElement | string | null,
  type?: 'button'
  onClick: React.MouseEventHandler<HTMLButtonElement> | undefined,
  className?: string,
}

const Button = forwardRef(({
  onClick,
  type,
  children,
  className,
}: IButtonProps, ref) => {

  return (
    <button
      ref={ref as React.RefObject<HTMLButtonElement>}
      type={type}
      onClick={onClick}
      className={`px-4 py-2 mx-2 text-sm font-medium text-white bg-green-600 rounded-md ${className}`}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
