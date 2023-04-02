/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { ErrorsMessages } from '../../types/ErrorsMessages';

type Props = {
  todos: Todo[],
  addTodo: (newTodoTitle: string) => Promise<void>,
  switchBtn: (AllChecked: boolean) => void
  errorMessage: (message: ErrorsMessages) => void
  disabled: boolean,
};

export const Header: React.FC<Props> = ({
  todos,
  addTodo,
  switchBtn,
  errorMessage,
  disabled,
}) => {
  const [newTodo, setNewTodo] = useState('');
  const isActive = todos.every(todo => todo.completed);

  const validateTodo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!newTodo.trim().length) {
      errorMessage(ErrorsMessages.Title);
    }

    if (newTodo.trim().length) {
      addTodo(newTodo);
      setNewTodo('');
    }
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames(
          'todoapp__toggle-all',
          { active: isActive },
        )}
        onClick={() => switchBtn(isActive)}
      />
      <form onSubmit={validateTodo}>
        <input
          type="text"
          className="todoapp__new-todo"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="What needs to be done?"
          disabled={disabled}
        />
      </form>
    </header>
  );
};
