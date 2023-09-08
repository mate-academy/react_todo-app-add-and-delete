/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';

import React, { ChangeEvent } from 'react';
import { useTodo } from '../TodoContext/TodoContext';

export const TodoHeader: React.FC = () => {
  const {
    todos,
    todosUncompleted,
    toogleAll,
    addTodo,
    setIsError,
    setErrorMessage,
    isOnAdd,
    inputValue,
    setInputValue,
  } = useTodo();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleTodoAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputValue.trim()) {
      setIsError(true);
      setErrorMessage("Title can't be empty");

      setTimeout(() => {
        setIsError(false);
      }, 3000);
    } else {
      addTodo(inputValue);
    }
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames(
            'todoapp__toggle-all',
            { active: !todosUncompleted },
          )}
          title="Togle All"
          onClick={toogleAll}
        />
      )}

      <form onSubmit={handleTodoAdd}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={inputValue}
          onChange={handleInputChange}
          disabled={isOnAdd}
        />
      </form>
    </header>
  );
};
