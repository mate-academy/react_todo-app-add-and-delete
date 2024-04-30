import React, { useEffect, useRef, useState } from 'react';
import { useAppContext } from '../context/Context';
import cn from 'classnames';
import { USER_ID, addTodo } from '../api/todos';

export const Header: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const {
    state: { todos },
    dispatch,
  } = useAppContext();

  const mainInputRef = useRef<HTMLInputElement>(null);

  const allCompleted = todos.every(todo => todo.completed);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const title = inputText.trim();

    if (title) {
      addTodo({ userId: USER_ID, title, completed: false })
        .then(savedTodo => {
          dispatch({ type: 'addTodo', payload: savedTodo });
        })
        .catch(() => {
          // setError('Unable to add todo');
        });

      setInputText('');
    }
  };

  const handleToggleAllClick = () => {
    if (allCompleted) {
      dispatch({
        type: 'setTodos',
        payload: todos.map(todo => ({
          ...todo,
          completed: false,
        })),
      });

      return;
    }

    dispatch({
      type: 'setTodos',
      payload: todos.map(todo => ({
        ...todo,
        completed: true,
      })),
    });
  };

  useEffect(() => {
    if (mainInputRef.current) {
      mainInputRef.current.focus();
    }
  }, [todos.length]);

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', { active: allCompleted })}
          data-cy="ToggleAllButton"
          onClick={handleToggleAllClick}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          ref={mainInputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={inputText}
          onChange={e => setInputText(e.target.value)}
        />
      </form>
    </header>
  );
};
