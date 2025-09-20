import React, { useEffect, useRef } from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';
import { USER_ID } from '../../api/todos';

type HeaderFormProps = {
  newTodoTitle: string;
  setTodoTitle: React.Dispatch<React.SetStateAction<string>>;
  onSubmit: (newTodo: Todo) => void;
  loading: boolean;
  isAllTasksCompleted: boolean;
  toggleAll: () => void;
  toggleAllButtonVisible: boolean;
};

export const Header: React.FC<HeaderFormProps> = ({
  newTodoTitle,
  setTodoTitle,
  onSubmit,
  loading,
  isAllTasksCompleted,
  toggleAll = () => {},
  toggleAllButtonVisible,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!loading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [loading]);

  const handleSubmit = (submitEvent: React.FormEvent) => {
    submitEvent.preventDefault();

    onSubmit({
      id: 0,
      userId: USER_ID,
      title: newTodoTitle.trim(),
      completed: false,
    });
  };

  return (
    <header className="todoapp__header">
      {toggleAllButtonVisible && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: isAllTasksCompleted && !loading,
          })}
          data-cy="ToggleAllButton"
          onClick={toggleAll}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputRef}
          value={newTodoTitle}
          onChange={e => setTodoTitle(e.target.value)}
          disabled={loading}
        />
      </form>
    </header>
  );
};
