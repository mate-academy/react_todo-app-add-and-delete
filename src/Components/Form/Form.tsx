import React from 'react';

type Props = {
  placeholder: string,
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
  value: string,
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void,
};

type Ref = HTMLInputElement | null;

export const Form = React.forwardRef<Ref, Props>(({
  placeholder,
  onInputChange,
  value,
  onSubmit,
}, ref) => (
  <form onSubmit={onSubmit}>
    <input
      type="text"
      className="todoapp__new-todo"
      placeholder={placeholder}
      onChange={onInputChange}
      ref={ref}
      value={value}
    />
  </form>
));
