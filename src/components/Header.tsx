import React, { useState } from 'react';
import { Todo } from '../types/Todo';
import { USER_ID } from '../api/todos';
import { client } from '../utils/fetchClient';
import classNames from 'classnames';

type Props = {
  inputRef: React.RefObject<HTMLInputElement>;
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setNotificationError: React.Dispatch<React.SetStateAction<string | null>>;
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>;
};

export const Header: React.FC<Props> = ({
  todos,
  setTodos,
  setNotificationError,
  setTempTodo,
  inputRef,
}) => {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);

  const allCompleted = todos.length > 0 && todos.every(todo => todo.completed);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setNotificationError('Title should not be empty');
      setTimeout(() => setNotificationError(null), 3000);

      return;
    }

    const newTempTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title: title.trim(),
      completed: false,
    };

    setTempTodo(newTempTodo);

    setLoading(true);

    client
      .post<Todo>('/todos', newTempTodo)
      .then(createdTodo => {
        setTodos(prev => [...prev, createdTodo]);
        setTitle('');
      })
      .catch(() => {
        setNotificationError('Unable to add a todo');
        setTimeout(() => setNotificationError(null), 3000);
      })
      .finally(() => {
        setLoading(false);
        setTempTodo(null);
        setTimeout(() => inputRef.current?.focus(), 0);
      });
  };

  const toggleAll = () => {
    setTodos(prev => prev.map(todo => ({ ...todo, completed: !allCompleted })));
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames('todoapp__toggle-all', { active: allCompleted })}
        data-cy="ToggleAllButton"
        onClick={toggleAll}
      />
      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={e => setTitle(e.target.value)}
          autoFocus
          disabled={loading}
        />
      </form>
    </header>
  );
};
