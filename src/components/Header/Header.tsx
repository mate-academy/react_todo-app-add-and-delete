/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext, useRef, useState } from 'react';
import classNames from 'classnames';

import './Header.scss';
import { TodosContext } from '../TodosContext';

export const Header: React.FC = () => {
  const { dispatch } = useContext(TodosContext);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [isToggleAllActive, setIsToggleAllActive] = useState(false);
  const formRef = useRef<HTMLFormElement | null>(null);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoTitle(event.target.value);
  };

  const handleToggleAllClick = () => {
    setIsToggleAllActive(!isToggleAllActive);
    dispatch({
      type: 'toggleAll',
      payload: !isToggleAllActive,
    });
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    event.preventDefault();

    if (event.key === 'Escape') {
      if (formRef.current) {
        formRef.current.reset();
      }
    }

    if (event.key === 'Enter') {
      if (formRef.current) {
        formRef.current.submit();
      }
    }
  };

  const handleTodoSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (newTodoTitle.trim().length) {
      dispatch({
        type: 'add',
        payload: {
          id: +new Date(),
          title: newTodoTitle,
          completed: false,
        },
      });
    }

    setNewTodoTitle('');
  };

  const handleTodoReset = () => {
    setNewTodoTitle('');
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        id="toggle-all"
        className={classNames('todoapp__toggle-all', {
          active: isToggleAllActive,
        })}
        data-cy="ToggleAllButton"
        onClick={handleToggleAllClick}
      />

      <form
        ref={formRef}
        onSubmit={handleTodoSubmit}
        onReset={handleTodoReset}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          onChange={handleTitleChange}
          onKeyUp={handleKeyUp}
        />
      </form>
    </header>
  );
};
