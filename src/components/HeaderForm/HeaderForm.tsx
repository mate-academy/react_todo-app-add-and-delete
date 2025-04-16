import React, { useEffect, useRef } from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';
import { USER_ID } from '../../api/todos';

type HeaderFormProps = {
  newTodoTitle: string;
  setTodoTitle: React.Dispatch<React.SetStateAction<string>>;
  onSubmit: (newTodo: Todo) => void;
  loading: boolean;
};

export const HeaderForm: React.FC<HeaderFormProps> = ({
  newTodoTitle,
  setTodoTitle,
  onSubmit,
  loading,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!loading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [loading]);

  function handleSublit(submitEvent: React.FormEvent) {
    submitEvent.preventDefault();

    onSubmit({
      id: 0,
      userId: USER_ID,
      title: newTodoTitle,
      completed: false,
    });
  }

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className={classNames('todoapp__toggle-all', 'active')}
        data-cy="ToggleAllButton"
      />

      <form onSubmit={handleSublit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputRef}
          value={newTodoTitle}
          onChange={e => {
            setTodoTitle(e.target.value);
          }}
          disabled={loading}
        />
      </form>
    </header>
  );
};
