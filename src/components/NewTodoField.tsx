import { useContext, useEffect, useRef, useState } from 'react';
import { DispatchContext, StatesContext } from '../context/Store';
import { addTodo } from '../api/todos';
import React from 'react';

export const NewTodoField: React.FC = () => {
  const dispatch = useContext(DispatchContext);
  const { isUpdating } = useContext(StatesContext);
  const [title, setTitle] = useState('');
  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch({ type: 'startUpdate' });
    if (!title.trim()) {
      dispatch({
        type: 'showError',
        payload: 'Title should not be empty',
      });
      dispatch({ type: 'stopUpdate' });
    } else {
      dispatch({
        type: 'addTempTodo',
        payload: { userId: 962, id: 0, title: title.trim(), completed: false },
      });
      addTodo({ userId: 962, title: title.trim(), completed: false })
        .then(newTodo => {
          dispatch({ type: 'addTodo', payload: newTodo });
          setTitle('');
        })
        .catch(() => {
          dispatch({ type: 'showError', payload: 'Unable to add a todo' });
        })
        .finally(() => {
          dispatch({ type: 'removeTempTodo' });
          dispatch({ type: 'stopUpdate' });
          inputRef.current?.focus();
        });
    }
  };

  useEffect(() => {
    inputRef.current?.focus();
  });

  return (
    <form onSubmit={handleOnSubmit}>
      <input
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={title}
        onChange={handleOnChange}
        disabled={isUpdating}
        ref={inputRef}
      />
    </form>
  );
};
