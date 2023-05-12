/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { FC, FormEvent, useState } from 'react';
import { addTodo } from '../../api/todos';
import { Todo } from '../../types/Todo';

interface Props {
  todos: Todo[];
  USER_ID: number;
  setTempTodo: (tempTodo: Todo | null) => void;
  setError: (error: string) => void;
}

const getNewId = (todos: Todo[]) => {
  return todos.reduce((acum: number, { id }: Todo) => {
    if (acum < id) {
      return id;
    }

    return acum;
  }, 0) + 1;
};

export const HeaderTodoApp: FC<Props> = React.memo(({
  todos,
  USER_ID,
  setTempTodo,
  setError,
}) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (!query) {
      setError("Title can't be empty");

      return;
    }

    const newTodo = addTodo({
      id: getNewId(todos),
      userId: USER_ID,
      title: query,
      completed: false,
    });

    newTodo.catch(() => {
      setError('Unable to add a todo');
    });

    setTempTodo({
      id: getNewId(todos),
      userId: USER_ID,
      title: query,
      completed: false,
    });

    setTimeout(() => {
      setTempTodo(null);
    }, 500);

    setQuery('');
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className="todoapp__toggle-all active"
        />
      )}

      <form
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </form>
    </header>
  );
});
