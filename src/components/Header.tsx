import React, { useContext, useState, useRef, useEffect } from 'react';
import cn from 'classnames';

import { USER_ID, postTodo } from '../api/todos';
import { StateContext, DispatchContext } from '../store/TodoContext';
import { useErrorMessage } from './useErrorMessage';

import { ActionType } from '../types/Actions';

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
      dispatch({ type: ActionType.SetIsInputFocused, payload: false });
    }
  }, [isInputFocused, dispatch]);

  function onFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsFormSubmitted(true);

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

    postTodo(newTodo)
      .then(todoFromServer => {
        dispatch({
          type: ActionType.SetTodos,
          payload: [...todos, todoFromServer],
        });
        setTodoTitle('');
      })
      .catch(() => {
        handleError('Unable to add a todo');
      })
      .finally(() => {
        dispatch({
          type: ActionType.SetTempTodo,
          payload: null,
        });
        dispatch({ type: ActionType.SetIsInputFocused, payload: true });
        dispatch({ type: ActionType.SetCurrentlyLoadingItemsIds, payload: [] });
        setIsFormSubmitted(false);
      });

    const tempTodo = {
      ...newTodo,
      id: 0,
    };

    dispatch({
      type: ActionType.SetTempTodo,
      payload: tempTodo,
    });

    dispatch({
      type: ActionType.SetCurrentlyLoadingItemsIds,
      payload: [tempTodo.id],
    });

    setTodoTitle('');
    setIsFormSubmitted(false);
  }

  function handleKeyUp(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Escape') {
      setTodoTitle('');
      dispatch({ type: ActionType.SetIsInputFocused, payload: true });
    }
  }

  function handleToggleAll() {
    const updatedTodos = todos.map(todo => ({
      ...todo,
      completed: !areAllTodosCompleted,
    }));

    dispatch({
      type: ActionType.SetTodos,
      payload: updatedTodos,
    });
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
          onKeyUp={handleKeyUp}
          disabled={isFormSubmitted}
        />
      </form>
    </header>
  );
};
