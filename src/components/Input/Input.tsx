import { forwardRef } from 'react';

type Props = {
  type: 'text' | 'checkbox';
  className: string;
  dataCy: string;
  placeholder?: string;
  title?: string;
  checked?: boolean;
  onBlur?: () => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const Input = forwardRef<HTMLInputElement, Props>(
  (
    {
      title,
      checked = false,
      type = '',
      className,
      dataCy,
      placeholder = '',
      onBlur = () => {},
      onChange = () => {},
    },
    ref,
  ) => (
    <input
      data-cy={dataCy}
      type={type}
      {...(type === 'checkbox' ? { checked: checked } : { value: title })}
      value={title}
      className={className}
      placeholder={placeholder}
      onBlur={onBlur}
      onChange={onChange}
      ref={ref}
    />
  ),
);

Input.displayName = 'Input';
