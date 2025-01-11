import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import { postTodo, updateTodo, USER_ID } from '../../api/todos';

type Props = {
  todos: Todo[];
  setTodos: (updater: ((todos: Todo[]) => Todo[]) | Todo[]) => void;
  setTempTodo: (todo: Todo | null) => void;
  setError: (newError: string) => void;
};

export const Header: React.FC<Props> = ({
  todos,
  setTodos,
  setTempTodo,
  setError,
}) => {
  const [query, setQuery] = useState('');
  const [disabled, setDisabled] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    input.current?.focus();
  }, [disabled, todos]);

  const onToggle = () => {
    const allCompleted = todos.every(todo => todo.completed);

    const updatedTodos = todos.map(todo => ({
      ...todo,
      completed: !allCompleted,
    }));

    Promise.all(
      updatedTodos.map(todo =>
        updateTodo(todo.id, { completed: todo.completed }),
      ),
    )
      .then(() => {
        setTodos(updatedTodos);
      })
      .catch(() => setError('cannot togle todos'));
  };

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setDisabled(true);
    const normalizedQuery = query.trim();

    if (!normalizedQuery) {
      setError('Title should not be empty');
      setDisabled(false);

      return;
    }

    const newTodo = {
      userId: USER_ID,
      title: normalizedQuery,
      completed: false,
    };

    setTempTodo({ ...newTodo, id: 0 });

    postTodo(newTodo)
      .then((createdTodo: Todo) => {
        setTodos(currentTodos => [...currentTodos, createdTodo]);
        setQuery('');
      })
      .catch(() => setError('Unable to add a todo'))
      .finally(() => {
        setDisabled(false);
        setTempTodo(null);
      });
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: todos.every(todo => todo.completed),
        })}
        data-cy="ToggleAllButton"
        onClick={onToggle}
      />

      <form onSubmit={event => onSubmit(event)}>
        <input
          ref={input}
          data-cy="NewTodoField"
          type="text"
          disabled={disabled}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={event => setQuery(event.target.value)}
        />
      </form>
    </header>
  );
};
