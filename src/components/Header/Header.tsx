/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import React, { useMemo } from 'react';
import { Todo } from '../../types/Todo';
import { TodoForm } from '../TodoForm';

type Props = {
  title: string,
  todos: Todo[],
  handleInput: (input: string) => void,
  handleAddTodo: (todoTitle: string) => void,
  isTitleDisabled: boolean,
};

export const Header: React.FC<Props> = ({
  title,
  todos,
  handleInput,
  handleAddTodo,
  isTitleDisabled,
}) => {
  const activeTodos = useMemo(() => {
    return todos.some(todo => !todo.completed);
  }, [todos]);

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      <button
        type="button"
        className={classNames(
          'todoapp__toggle-all', {
            active: activeTodos,
          },
        )}
        disabled={activeTodos}
      />

      {/* Add a todo on form submit */}
      <TodoForm
        title={title}
        handleInput={handleInput}
        handleAddTodo={handleAddTodo}
        isTitleDisabled={isTitleDisabled}
      />
    </header>
  );
};
