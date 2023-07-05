/* eslint-disable jsx-a11y/control-has-associated-label */
import cn from 'classnames';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { Todo } from '../../types/Todo';

interface Props {
  visibleTodos: Todo[];
  addTodo: (title: string) => void;
  onError: Dispatch<SetStateAction<string | null>>;
  isLoading: boolean;
}

export const Header: React.FC<Props> = ({
  visibleTodos,
  addTodo,
  onError,
  isLoading,
}) => {
  const [newTitle, setNewTitle] = useState('');

  const handleSubmitButton = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (newTitle.trim()) {
      addTodo(newTitle);
      setNewTitle('');
    }

    if (!newTitle.trim()) {
      onError("Title can't be empty");
    }
  };

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      {visibleTodos.length > 0 && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: visibleTodos.every(todo => todo.completed),
          })}
        />
      )}

      {/* Add a todo on form submit */}
      <form
        onSubmit={handleSubmitButton}
      >
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTitle}
          onChange={(event) => setNewTitle(event.target.value)}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
