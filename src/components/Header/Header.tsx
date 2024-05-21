import { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import { Error } from '../../types/Error';

import { USER_ID, addTodo } from '../../api/todos';

interface Props {
  todos: Todo[];
  deleteIds: number[];
  setTodos: (todos: Todo[]) => void;
  setTempTodo: (tempTodo: Todo | null) => void;
  setError: React.Dispatch<React.SetStateAction<Error | null>>;
}

export const Header: React.FC<Props> = ({
  todos,
  deleteIds,
  setTodos,
  setTempTodo,
  setError,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [newTitle, setNewTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    inputRef.current?.focus();
  }, [isLoading, deleteIds.length]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(e.target.value);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedTitle = newTitle.trim();

    if (!trimmedTitle) {
      setError(Error.EmptyTitle);

      return;
    }

    setIsLoading(true);

    const newTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    }

    setTempTodo({ ...newTodo, id: 0 });

    addTodo(newTodo)
      .then((todo: Todo) => {
        setTodos([...todos, todo]);
        setNewTitle('');
      })
      .catch(() => {
        setError(Error.UnableAdd);
        setNewTitle(newTodo.title);
      })
      .finally(() => {
        setIsLoading(false);
        setTempTodo(null);
    });
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={newTitle}
          ref={inputRef}
          data-cy="NewTodoField"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={handleChange}
          autoFocus
          disabled={isLoading || !!deleteIds.length}
        />
      </form>
    </header>
  );
};
