/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext } from 'react';
import classNames from 'classnames';
import { TodoContext } from '../context/todoContext';

export const AddTodoFormHeader: React.FC = () => {
  const {
    inputValue, addNewTodoInput, handleSubmit, countItemsLeft,
  }
    = useContext(TodoContext);

  const activeTasks = countItemsLeft();

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames({
          'todoapp__toggle-all': true,
          'todoapp__toggle-all active': activeTasks > 0,
        })}
      />

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={inputValue}
          onChange={(event) => {
            addNewTodoInput(event.target.value);
          }}
        />
      </form>
    </header>
  );
};
