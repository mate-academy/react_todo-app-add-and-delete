import React, { useContext, useState, useRef, useEffect } from 'react';
import cn from 'classnames';

import { USER_ID, postTodo } from '../api/todos';
import { StateContext, DispatchContext } from '../store/TodoContext';
import { useErrorMessage } from './useErrorMessage';

import {
  setInputFocuseAction,
  setTodosAction,
  setTempTodoAction,
  setCurrentlyLoadingItemsIdsAction,
} from './todoActions';

export const Header: React.FC = () => {
  const { todos, isInputFocused } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);
  const handleError = useErrorMessage();

  const [todoTitle, setTodoTitle] = useState('');
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const focusField = useRef<HTMLInputElement>(null);
  const areAllTodosCompleted = todos.every(todo => todo.completed);

  useEffect(() => {
    if (isInputFocused && focusField.current) {
      focusField.current.focus();
      dispatch(setInputFocuseAction(false));
    }
  }, [isInputFocused, dispatch]);

  function onFormSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!todoTitle.trim().length) {
      handleError('Title should not be empty');
      setIsFormSubmitted(false);

      return;
    }

    const newTodo = {
      title: todoTitle.trim(),
      completed: false,
      userId: USER_ID,
    };

    setIsFormSubmitted(true);

    postTodo(newTodo)
      .then(todoFromServer => {
        dispatch(setTodosAction([...todos, todoFromServer]));
        setTodoTitle('');
      })
      .catch(() => {
        handleError('Unable to add a todo');
      })
      .finally(() => {
        dispatch(setTempTodoAction(null));
        dispatch(setInputFocuseAction(true));
        dispatch(setCurrentlyLoadingItemsIdsAction([]));
        setIsFormSubmitted(false);
      });

    const tempTodo = {
      ...newTodo,
      id: 0,
    };

    dispatch(setTempTodoAction(tempTodo));

    dispatch(setCurrentlyLoadingItemsIdsAction([tempTodo.id]));
  }

  function handleEscKeyUp(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Escape') {
      setTodoTitle('');
      dispatch(setInputFocuseAction(true));
    }
  }

  function handleToggleAll() {
    const updatedTodos = todos.map(todo => ({
      ...todo,
      completed: !areAllTodosCompleted,
    }));

    dispatch(setTodosAction(updatedTodos));
  }

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={cn('todoapp__toggle-all', { active: areAllTodosCompleted })}
        data-cy="ToggleAllButton"
        onClick={handleToggleAll}
        disabled={todos.length === 0}
      />
      <form onSubmit={onFormSubmit}>
        <input
          ref={focusField}
          value={todoTitle}
          onChange={event => setTodoTitle(event.target.value)}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onKeyUp={handleEscKeyUp}
          disabled={isFormSubmitted}
        />
      </form>
    </header>
  );
};
