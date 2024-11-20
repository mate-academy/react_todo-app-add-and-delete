import classNames from 'classnames';
import React from 'react';

import { useAppContext } from '../../context/AppContext';

import { useToggleAllTodosCompletion } from '../../utils/todoHandlers';

import { TodoForm } from './TodoForm';

export const Header: React.FC = () => {
  const { todos } = useAppContext();
  const toggleAllTodosCompletion = useToggleAllTodosCompletion();
  const isEveryTodoCompleted = todos.every(todo => todo.completed);

  function handleToggleAllTodosCompletion() {
    toggleAllTodosCompletion();
  }

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: isEveryTodoCompleted,
        })}
        data-cy="ToggleAllButton"
        onClick={handleToggleAllTodosCompletion}
      />

      <TodoForm />
    </header>
  );
};
