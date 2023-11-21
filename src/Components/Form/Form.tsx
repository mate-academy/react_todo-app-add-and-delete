import React from 'react';

type Props = {
  placeholder: string,
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
  value: string,
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void,
  forCypress: string,
};

type Ref = HTMLInputElement | null;

export const Form = React.forwardRef<Ref, Props>(({
  placeholder,
  onInputChange,
  value,
  onSubmit,
  forCypress,
}, ref) => (
  <form onSubmit={onSubmit}>
    <input
      data-cy={forCypress}
      type="text"
      className="todoapp__new-todo"
      placeholder={placeholder}
      onChange={onInputChange}
      ref={ref}
      value={value}
    />
  </form>
));
