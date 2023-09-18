/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { ChangeEvent, useState } from 'react';
import classNames from 'classnames';
import { useTodo } from '../TodoContext/TodoContext';

export const TodoHeader: React.FC = () => {
  const {
    todosUncompleted,
    toogleAll,
    addTodo,
    setIsError,
    setErrorMessage,
  } = useTodo();
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleTodoAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputValue.trim()) {
      setIsError(true);
      setErrorMessage('Unable to add a todo');
    } else {
      addTodo(inputValue);
    }

    setTimeout(() => {
      setInputValue('');
    }, 500);
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames(
          'todoapp__toggle-all',
          { active: todosUncompleted },
        )}
        title="Togle All"
        onClick={toogleAll}
      />

      <form onSubmit={handleTodoAdd}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={inputValue}
          onChange={handleInputChange}
        />
      </form>
    </header>
  );
};
