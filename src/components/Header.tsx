import { useCallback, useState } from 'react';
import { addTodo, USER_ID } from '../api/todos';
import { Todo } from '../types/Todo';

type HeaderProps = {
  inputRef: React.RefObject<HTMLInputElement>;
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;
  setError: (error: string) => void;
  setTempTodo: (todo: Todo | null) => void;
  setAddingTodoId: (addingTodoId: number | null) => void;
};

export const Header: React.FC<HeaderProps> = ({
  inputRef,
  setTodos,
  todos,
  setError,
  setTempTodo,
  setAddingTodoId,
}) => {
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const trimmedTitle = title.trim();

      if (!trimmedTitle) {
        setError('Title should not be empty');

        return;
      }

      setTempTodo({
        id: 0,
        userId: USER_ID,
        title: trimmedTitle,
        completed: false,
      });
      setAddingTodoId(0);
      setIsLoading(true);
      addTodo(trimmedTitle)
        .then(todo => {
          const newTodos = [...todos, todo];

          setTodos(newTodos);
          setTitle('');
          setAddingTodoId(null);
        })
        .catch(() => {
          setError('Unable to add a todo');
          setAddingTodoId(null);
          setTodos(todos);
          if (inputRef.current) {
            setTimeout(() => {
              inputRef.current?.focus();
            }, 0);
          }

          setTimeout(() => setError(''), 3000);
        })
        .finally(() => {
          setTempTodo(null);
          setIsLoading(false);
        });
    },
    [title, todos, inputRef, setError, setTempTodo, setAddingTodoId, setTodos],
  );

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
        aria-label="Toggle all todos"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          ref={inputRef}
          onChange={e => setTitle(e.target.value)}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
