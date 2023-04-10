import React from 'react';

import classNames from 'classnames';

import { Todo } from '../../types/Todo';

interface Props {
  todos: Todo[],
  value: string,
  onInput: (title: string) => void,
}

export const HeaderTodo: React.FC<Props> = (props) => {
  const {
    todos,
    value,
    onInput,
  } = props;

  const isTodos = todos.length > 0;
  const hasCompletedTodo = todos.some(todo => todo.completed);

  const handleQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;

    onInput(query);
  };

  return (
    <header className="todoapp__header">
      {isTodos && (
        <button
          type="button"
          className={classNames(
            'todoapp__toggle-all',
            {
              active: hasCompletedTodo,
            },
          )}
          aria-label="active"
        />
      )}

      <form>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={value}
          onChange={handleQuery}
        />
      </form>
    </header>
  );
};
