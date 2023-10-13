/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  FormEvent,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import classNames from 'classnames';

import './Header.scss';
import { TodosContext } from '../TodosContext';
import { createTodo } from '../../api/todos';

const USER_ID = 11677;

export const Header: React.FC = () => {
  const {
    dispatch,
    setErrorMessage,
    tempTodo,
    setTempTodo,
  } = useContext(TodosContext);

  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [isToggleAllActive, setIsToggleAllActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => inputRef.current?.focus());

  const handleToggleAllClick = () => {
    setIsToggleAllActive(!isToggleAllActive);
    dispatch({
      type: 'toggleAll',
      payload: !isToggleAllActive,
    });
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoTitle(event.target.value);
  };

  const handleTodoSubmit = (event: FormEvent) => {
    event.preventDefault();

    const trimmedTitle = newTodoTitle.trim();

    if (trimmedTitle.length) {
      const newTodo = {
        id: +new Date(),
        userId: USER_ID,
        title: trimmedTitle,
        completed: false,
      };

      setTempTodo(newTodo);

      dispatch({
        type: 'add',
        payload: newTodo,
      });

      createTodo(newTodo)
        .then(() => {
          setNewTodoTitle('');
        })
        .catch(() => {
          setErrorMessage('Unable to add a todo');
          dispatch({
            type: 'remove',
            payload: newTodo.id,
          });
        })
        .finally(() => {
          setTempTodo(null);
        });
    } else {
      setErrorMessage('Title should not be empty');
    }
  };

  const handleTitleReset = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setNewTodoTitle('');
    }
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
        onSubmit={handleTodoSubmit}
      >
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={!!tempTodo}
          value={newTodoTitle}
          onChange={handleTitleChange}
          onKeyUp={handleTitleReset}
        />
      </form>
    </header>
  );
};
