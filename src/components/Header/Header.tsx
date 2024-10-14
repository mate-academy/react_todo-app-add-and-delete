import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';

import { Todo } from '../../types/Todo';
import { ErrorMessages } from '../../types/ErrorMessages';
import * as todoService from '../../api/todos';

type Props = {
  todos: Todo[];
  onTodos: (toggledTodos: Todo[]) => void;
  onAdd: (newTodo: Todo) => void;
  onErrorMessage: (error: ErrorMessages) => void;
  onTempTodo: (tempTodo: Todo | null) => void;
};

export const Header: React.FC<Props> = ({
  todos,
  onTodos: onTodosChange,
  onAdd,
  onErrorMessage,
  onTempTodo,
}) => {
  const titleField = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmiting] = useState(false);

  const areAllTodosCompleted = todos.every(todo => todo.completed);

  const handleToggleCompleteStatus = () => {
    onTodosChange(
      todos.map(todo => ({
        ...todo,
        completed: !areAllTodosCompleted,
      })),
    );
  };

  const handleError = (error: ErrorMessages) => {
    onErrorMessage(error);
    setTimeout(() => {
      onErrorMessage(ErrorMessages.None);
    }, 3000);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      handleError(ErrorMessages.Title);
    }

    setIsSubmiting(true);

    const createdTempTodo = {
      id: 0,
      userId: todoService.USER_ID,
      title: title.trim(),
      completed: false,
    };

    onTempTodo(createdTempTodo);

    todoService
      .postTodos(title.trim())
      .then(newTodo => {
        onAdd(newTodo);
        setTitle('');
      })
      .catch(() => handleError(ErrorMessages.Add))
      .finally(() => {
        setIsSubmiting(false);
        onTempTodo(null);
      });
  };

  useEffect(() => {
    titleField.current?.focus();
  }, [todos, isSubmitting]);

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: areAllTodosCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={handleToggleCompleteStatus}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          ref={titleField}
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
