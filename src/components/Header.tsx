/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { TodoContext } from '../context/TodoContext';
import { USER_ID } from '../variables/UserID';
import { createTodo } from '../api/todos';
import classNames from 'classnames';

export const Header: React.FC = () => {
  const [isDisabled, setIsDisabled] = useState(false);
  const {
    title,
    todos,
    setTodos,
    setTempTodo,
    setTitle,
    setErrorMessage,
    errorMessage,
  } = useContext(TodoContext);

  const titleField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (titleField.current) {
      titleField.current.focus();
    }
  }, [todos, errorMessage]);

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value)
  };

  const completedTodos = useMemo(() => {
    return !todos.filter(todo => !todo.completed).length;
  }, [todos]);

  const addTodo = () => {
    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: title.trim(),
      completed: false,
    });

    createTodo({
      userId: USER_ID,
      title: title.trim(),
      completed: false,
    })
      .then(todoFromServer => {
        setTodos(curr => [...curr, todoFromServer]);
        setTitle('');
        setTempTodo(null);
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
        setTempTodo(null);
      })
      .finally(() => {
        setIsDisabled(false);
      });
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (title.trim()) {
      setIsDisabled(true);
      addTodo();
    } else {
      setErrorMessage('Title should not be empty');
    }
  };


  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames('todoapp__toggle-all',
        { active: completedTodos })}
        data-cy="ToggleAllButton"
      />

      <form onSubmit={handleSubmit}>
        <input
          ref={titleField}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={handleInput}
          value={title}
          disabled={isDisabled}
        />
      </form>
    </header>
  );
};