import React, { useState, useEffect, useRef } from 'react';

import cn from 'classnames';

type Props = {
  isAllCompleted: boolean;
  isInputProcessing: boolean;
  todosAmount: number;
  handleSubmit: (inputedTitle: string) => Promise<boolean>;
  isErrorState: boolean;
};

export const TodoHeader: React.FC<Props> = ({
  isAllCompleted,
  isInputProcessing,
  todosAmount,
  handleSubmit,
  // isErrorState,
}) => {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const onHandleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normilezedInputValue = inputValue.trim();

    const success = await handleSubmit(normilezedInputValue);

    if (success) {
      setInputValue('');
    }
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, [todosAmount, isInputProcessing]);

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
          disabled={isInputProcessing}
        />
      </form>
    </header>
  );
};
