import React, { useContext, useEffect, useRef } from 'react';
import cl from 'classnames';
import { Context } from '../constext';
import { USER_ID, addTodo } from '../../api/todos';

export const Header: React.FC = () => {
  const {
    tempTodo,
    todoTitleHeader,
    setTodoTitleHeader,
    notifyError,
    setTempTodo,
    setTodos,
    todos,
    activeTodos,
  } = useContext(Context);

  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    ref.current?.focus();
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTodoTitleHeader(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const workTitleHeader = todoTitleHeader.trim();

    if (!workTitleHeader) {
      notifyError('Title should not be empty');

      return;
    }

    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: workTitleHeader,
      completed: false,
    });

    addTodo(workTitleHeader)
      .then(newTodo => {
        setTodos(prevTodos => [...prevTodos, newTodo]);
        setTodoTitleHeader('');
        ref.current?.focus();
      })
      .catch(() => {
        notifyError('Unable to add a todo');
      })
      .finally(() => {
        setTempTodo(null);
      });
  };

  return (
    <header className="todoapp__header">
      {/* eslint-disable-next-line */}
      <button
        type="button"
        className={cl('todoapp__toggle-all', {
          active: activeTodos?.length === 0,
          hidden: todos?.length === 0,
        })}
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={ref}
          value={todoTitleHeader}
          onChange={handleChange}
          disabled={!!tempTodo}
        />
      </form>
    </header>
  );
};
