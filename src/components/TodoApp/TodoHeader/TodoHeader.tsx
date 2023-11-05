/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import * as todoService from '../../../api/todos';

import {
  DispatchContext,
  StateContext,
  USER_ID,
  actionCreator,
} from '../../TodoStore';
import { TodoError } from '../../../types/TodoError';

export const TodoHeader: React.FC = () => {
  const { isSubmitting, selectedFilter } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);
  const [title, setTitle] = useState('');
  const focusedInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (focusedInput.current) {
      focusedInput.current.focus();
    }
  }, [isSubmitting]);

  const handleSubmit = useCallback((
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!title.trim()) {
      dispatch(actionCreator.addError(TodoError.ErrorTodo));

      return;
    }

    dispatch(actionCreator.addTempTodo({
      id: 0, title: title.trim(), userId: USER_ID, completed: false,
    }));

    dispatch(actionCreator.toggleSubmitting());
    dispatch(actionCreator.clearError());
    todoService.addTodo({
      title: title.trim(), userId: USER_ID, completed: false,
    })
      .then(newTodo => {
        dispatch(actionCreator.updateTodos({
          add: newTodo, filter: selectedFilter,
        }));
      })
      .catch(error => {
        dispatch(actionCreator.addError(TodoError.ErrorAdd));
        throw error;
      })
      .then(() => setTitle(''))
      .finally(() => {
        dispatch(actionCreator.addTempTodo(null));
        dispatch(actionCreator.toggleSubmitting());
      });
  }, [selectedFilter, title]);

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      <form
        onSubmit={handleSubmit}
      >
        <input
          ref={focusedInput}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={event => setTitle(event.target.value)}
          disabled={isSubmitting}
        />
      </form>
    </header>
  );
};
