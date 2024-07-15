/* eslint-disable jsx-a11y/control-has-associated-label */

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';
import { USER_ID, addTodo } from '../api/todos';
import { Todo } from '../types/Todo';
import { Errors } from '../types/Errors';

type Props = {
  todos: Todo[];
  updateTodos: (todoItems: Todo[]) => void;
  addTempTodo: (todoItem: Todo | null) => void;
  errorText: Errors | null;
  addErrorText: (errorMessage: Errors | null) => void;
  clearTimeoutError: () => void;
};

export const TodoApp: React.FC<Props> = ({
  todos,
  updateTodos,
  addTempTodo,
  errorText,
  addErrorText,
  clearTimeoutError,
}) => {
  const [query, setQuery] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const addingTodoField = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (addingTodoField.current && !isSubmitting) {
      addingTodoField.current.focus();
    }
  }, [isSubmitting, todos]);

  const isEveryTodoCompleted = useMemo(
    () => todos.every(todoItem => todoItem.completed),
    [todos],
  );

  const handleQueryChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>): void => {
      setQuery(event.target.value);
    },
    [],
  );

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>): void => {
      event.preventDefault();

      if (isSubmitting) {
        return;
      }

      if (errorText) {
        addErrorText(null);
      }

      if (!query.trim()) {
        addErrorText(Errors.emptyTitle);
        clearTimeoutError();

        return;
      }

      setIsSubmitting(true);

      addTempTodo({
        id: 0,
        userId: USER_ID,
        title: query.trim(),
        completed: false,
      });

      addTodo({
        userId: USER_ID,
        title: query.trim(),
        completed: false,
      })
        .then(addedTodo => {
          updateTodos([...todos, addedTodo]);

          setQuery('');
        })
        .catch(() => {
          addErrorText(Errors.unableToAdd);
          clearTimeoutError();
        })
        .finally(() => {
          setIsSubmitting(false);
          addTempTodo(null);
        });
    },
    [
      query,
      isSubmitting,
      todos,
      updateTodos,
      errorText,
      addErrorText,
      clearTimeoutError,
      addTempTodo,
    ],
  );

  const handleToggleAllTodos = useCallback(() => {
    if (isEveryTodoCompleted) {
      updateTodos(
        todos.map(todoItem => ({
          ...todoItem,
          completed: false,
        })),
      );
    } else {
      updateTodos(
        todos.map(todoItem => ({
          ...todoItem,
          completed: true,
        })),
      );
    }
  }, [isEveryTodoCompleted, todos, updateTodos]);

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: isEveryTodoCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={handleToggleAllTodos}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          ref={addingTodoField}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={handleQueryChange}
          disabled={isSubmitting}
        />
      </form>
    </header>
  );
};
