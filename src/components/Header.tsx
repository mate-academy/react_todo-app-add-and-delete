import React, { useState, useContext, useRef, useEffect } from 'react';
import cn from 'classnames';
import debounce from 'lodash/debounce';
import { DispatchContext, StateContext } from '../managment/TodoContext';
import { USER_ID, createTodos, updateTodo } from '../api/todos';

export const Header: React.FC = () => {
  const dispatch = useContext(DispatchContext);
  const [title, setTitle] = useState('');
  const { todos } = useContext(StateContext);

  const allCompleted = todos.every(todo => todo.completed);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const userId = USER_ID;

  useEffect(() => {
    if (inputRef.current && !title) {
      inputRef.current.focus();
    }
  }, [title]);

  const debouncedHandleSubmit = useRef(
    debounce(data => {
      createTodos(data)
        .then(newTodo => {
          dispatch({ type: 'addTodo', payload: newTodo });
          setTitle('');
        })
        .catch(() => {
          dispatch({ type: 'errorMessage', payload: 'Unable to add a todo' });
        })
        .finally(() => {
          if (inputRef.current) {
            inputRef.current.disabled = false;
            inputRef.current.focus();
          }

          dispatch({ type: 'isLoading', payload: false });
          dispatch({ type: 'tempTodo', payload: null });
          dispatch({ type: 'clearCurrentId' });
        });
    }, 300),
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (inputRef.current) {
      inputRef.current.disabled = true;
    }

    const data = {
      title: title.trim(),
      userId,
      completed: false,
    };

    if (data.title.trim()) {
      dispatch({
        type: 'tempTodo',
        payload: { id: 0, userId, title: title.trim(), completed: false },
      });
      dispatch({ type: 'isLoading', payload: true });
      dispatch({ type: 'createCurrentId', payload: 0 });

      debouncedHandleSubmit.current(data); // Call the debounced function
    } else {
      dispatch({ type: 'errorMessage', payload: 'Title should not be empty' });
      setTitle('');

      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const handleChangeStatusAll = () => {
    dispatch({ type: 'isLoading', payload: true });
    todos.forEach(todo => {
      dispatch({ type: 'createCurrentId', payload: todo.id });

      updateTodo({
        id: todo.id,
        title: todo.title,
        completed: !allCompleted,
      })
        .then(newTodo => {
          dispatch({
            type: 'changeStatusAll',
            payload: newTodo.completed,
          });
        })
        .catch(() => {
          dispatch({
            type: 'errorMessage',
            payload: 'Unable to update a todo',
          });
        })
        .finally(() => {
          dispatch({ type: 'isLoading', payload: false });
          dispatch({ type: 'clearCurrentId' });
        });
    });
  };

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', { active: allCompleted })}
          data-cy="ToggleAllButton"
          aria-label="Toggle all completed"
          onClick={handleChangeStatusAll}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={inputRef}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
      </form>
    </header>
  );
};
