import React, { useState, useEffect, useRef } from 'react';

import cn from 'classnames';

type Props = {
  isAllCompleted: boolean;
  todosAmount: number;
  handleSubmit: (inputedTitle: string) => void;
};

export const TodoHeader: React.FC<Props> = ({
  isAllCompleted,
  todosAmount,
  handleSubmit,
}) => {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const onHandleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleSubmit(inputValue);
    setInputValue('');
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, [todosAmount]);

  return (
    <header className="todoapp__header">
      {!!todosAmount && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', { active: isAllCompleted })}
          data-cy="ToggleAllButton"
        />
      )}
      <form onSubmit={e => onHandleSubmit(e)}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputRef}
          value={inputValue}
          onChange={e => {
            setInputValue(e.currentTarget.value);
          }}
        />
      </form>
    </header>
  );
};
