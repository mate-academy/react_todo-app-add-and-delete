import React, { useEffect } from 'react';
import { Todo } from './types/Todo';
import { USER_ID } from './api/todos';

// interface TodoInput {
//   title: string;
//   userId: number;
//   completed: boolean;
// }

interface Props {
  setError: (error: string | null) => void;
  newTodoTitle: string;
  setLoadingTodo: (value: boolean) => void;
  setTempTodo: (todo: Todo) => void;
  setNewTodoTitle: (value: string) => void;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  loadingTodo: boolean;
  handleAddTodo: (title: string) => Promise<void>;
  inputRef: React.RefObject<HTMLInputElement>;
}

export const Header: React.FC<Props> = ({
  setError,
  newTodoTitle,
  setLoadingTodo,
  setTempTodo,
  setNewTodoTitle,
  loadingTodo,
  handleAddTodo,
  inputRef,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!loadingTodo) {
        inputRef.current?.focus();
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [loadingTodo]);

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
        onClick={() => setError(null)}
      />

      {/* Add a todo on form submit */}
      <form
        onSubmit={event => {
          event.preventDefault();

          const trimmedTitle = newTodoTitle.trim();

          if (!trimmedTitle) {
            setError('Title should not be empty');

            setTimeout(() => {
              setError(null);
            }, 3000);

            return;
          }

          setError(null);

          const newTodo = {
            title: trimmedTitle,
            userId: USER_ID,
            completed: false,
          };

          const tempTask = {
            id: 0,
            title: trimmedTitle,
            userId: USER_ID,
            completed: false,
          };

          setTempTodo(tempTask);

          setLoadingTodo(true);
          handleAddTodo(newTodo.title);
        }}
      >
        <input
          value={newTodoTitle}
          onChange={e => setNewTodoTitle(e.target.value)}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          autoFocus
          disabled={loadingTodo}
          ref={inputRef}
        />
      </form>
    </header>
  );
};
