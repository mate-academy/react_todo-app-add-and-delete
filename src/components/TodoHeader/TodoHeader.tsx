import {
  useContext, useRef, useEffect, useState,
} from 'react';

import { TodoContext } from '../../context/TodoContext';
import { Todo } from '../../types/Todo';
import { USER_ID } from '../../utils/variables';
import { createTodo } from '../../api/todos';
import { LoadingContext } from '../../context/LoadingContext';

type Props = {
  onAddError: (value: string) => void;
  onHideError: (value: boolean) => void;
};

export const TodoHeader: React.FC<Props> = ({
  onAddError, onHideError,
}) => {
  const { todos, setTodos, setTempTodo } = useContext(TodoContext);
  const { isLoading, setIsLoading } = useContext(LoadingContext);

  const [title, setTitle] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [todos, isLoading]);

  const toggleAll = () => {
    setTodos(currentTodos => {
      return currentTodos.map(currentTodo => ({
        ...currentTodo,
        completed: !currentTodo.completed,
      }));
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      onAddError('Title should not be empty');
      onHideError(false);

      setTimeout(() => {
        onHideError(true);
      }, 3000);

      return;
    }

    setIsLoading(true);

    setTempTodo({
      id: 0,
      userId: USER_ID,
      title,
      completed: false,
    });

    createTodo({
      userId: USER_ID,
      title: title.trim(),
      completed: false,
    })
      .then(newTodo => {
        setTodos((prevTodos: Todo[]) => [...prevTodos, newTodo]);
        setTitle('');
      })
      .catch(() => onAddError('Unable to add a todo'))
      .finally(() => {
        setIsLoading(false);
        setTempTodo(null);
      });
  };

  return (
    <header className="todoapp__header">
      {!!todos.filter(({ completed }) => !completed).length && (
        <button
          type="button"
          aria-label="toggle all"
          className="todoapp__toggle-all active"
          data-cy="ToggleAllButton"
          onClick={toggleAll}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          disabled={isLoading}
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
      </form>
    </header>
  );
};
