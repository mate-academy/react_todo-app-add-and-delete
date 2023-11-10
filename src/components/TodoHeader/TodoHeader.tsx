/* eslint-disable no-console */

import { useDispatch, useSelector } from 'react-redux';
import React from 'react';
import { AppDispatch, RootState } from '../../redux/store';
import {
  clearTempTodo,
  setErrorType,
  setInputValue,
  setTempTodo,
} from '../../redux/todoSlice';
import { ErrorType } from '../../types/errorType';
import { addTodo } from '../../redux/todoThunks';

export const TodoHeader: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const inputValue = useSelector((state: RootState) => state.todos.inputValue);
  const errorType = useSelector((state: RootState) => state.todos.errorType);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setInputValue(event.target.value));
  };

  const handleAddTodo = (title: string) => {
    if (!title) {
      dispatch(setErrorType(ErrorType.EmptyTitle));

      return Promise.resolve();
    }

    const newTempTodo = {
      id: 0,
      title,
      completed: false,
    };

    dispatch(setTempTodo(newTempTodo));

    return dispatch(addTodo({ title }))
      .then(() => {
        dispatch(clearTempTodo());
      })
      .catch((err: Error) => {
        console.error('Unable to add todo:', err);
        dispatch(clearTempTodo());
        dispatch(setErrorType(ErrorType.AddTodoError));
        throw new Error(err.message);
      });
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleAddTodo(inputValue);

    if (!errorType) {
      dispatch(setInputValue(''));
    }
  };

  return (
    <header className="todoapp__header">
      {/*
       this buttons is active only if there are some active todos
       still needs implementation
        */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
        aria-label="Toggle All"
      />

      <form onSubmit={handleFormSubmit}>
        <input
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
          data-cy="NewTodoField"
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
