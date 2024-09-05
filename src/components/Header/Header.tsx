import cn from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
type Props = {
  onHandleAddingTodo: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  isAllTodosCompleted: boolean;
  isSubmiting: boolean;
  isClearTitle: boolean;
  onSetIsClearTitle: (needClear: boolean) => void;
};

export const Header: React.FC<Props> = ({
  onHandleAddingTodo,
  isAllTodosCompleted,
  isSubmiting,
  isClearTitle,
  onSetIsClearTitle,
}) => {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  });

  useEffect(() => {
    if (isClearTitle) {
      setValue('');
      onSetIsClearTitle(false);
    }
  }, [isClearTitle, onSetIsClearTitle]);
  const handleInputOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={cn('todoapp__toggle-all', { active: isAllTodosCompleted })}
        data-cy="ToggleAllButton"
      />

      <form>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputRef}
          onKeyDown={onHandleAddingTodo}
          disabled={isSubmiting}
          onChange={handleInputOnChange}
          value={value}
        />
      </form>
    </header>
  );
};
