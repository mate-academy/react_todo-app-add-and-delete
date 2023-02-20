/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import React, { useMemo } from 'react';
import { Todo } from '../../types/Todo';
import { TodoForm } from '../TodoForm';

type Props = {
  query: string,
  todos: Todo[],
  handleInput: (input: string) => void,
};

export const Header: React.FC<Props> = ({ query, todos, handleInput }) => {
  const activeTodos = useMemo(() => {
    return todos.filter(todo => !todo.completed);
  }, [todos]);

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      <button
        type="button"
        className={classNames(
          'todoapp__toggle-all', {
            active: activeTodos.length,
          },
        )}

      />

      {/* Add a todo on form submit */}
      <TodoForm
        query={query}
        handleInput={handleInput}
      />
    </header>
  );
};
