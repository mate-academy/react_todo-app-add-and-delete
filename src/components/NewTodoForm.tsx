/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { getTodo } from '../api/todos';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[],
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void,
  newTodoTitle: string,
  setNewTodoTitle: (event: string) => void,
};

export const NewTodoForm: React.FC<Props> = (
  {
    todos, onSubmit, newTodoTitle, setNewTodoTitle,
  },
) => {
  const [todo, setTodo] = useState<Todo>();

  useEffect(() => {
    if (todo) {
      getTodo(todo.id).then(setTodo);
    }
  });

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames(
          'todoapp__toggle-all',
          { active: todos.some((td) => !td.completed) },
        )}
      />

      {/* Add a todo on form submit */}
      <form onSubmit={onSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          onChange={(event) => setNewTodoTitle(event.target.value)}
        />
      </form>
    </header>
  );
};
