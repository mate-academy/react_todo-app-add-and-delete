import classNames from 'classnames';
import React, { useState } from 'react';
import { NewTodo } from '../../types/NewTodo';
import { USER_ID } from '../USER_ID';

interface Props {
  isActive: boolean;
  onSubmit: (newTodo: NewTodo) => void,
  isLoading: boolean
}

export const Header: React.FC<Props> = React.memo(({
  isActive,
  onSubmit,
  isLoading,
}) => {
  const [todoInput, setTodoInput] = useState('');
  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTodoInput(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newTodo: NewTodo = {
      title: todoInput,
      completed: false,
      userId: USER_ID,
    };

    onSubmit(newTodo);
    setTodoInput('');
  };

  return (
    <header className="todoapp__header">

      <button
        type="button"
        aria-label="button"
        className={classNames('todoapp__toggle-all',
          { active: isActive })}
      />

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          aria-label="new todo"
          value={todoInput}
          onChange={handleInput}
          disabled={isLoading}
        />
      </form>
    </header>
  );
});
