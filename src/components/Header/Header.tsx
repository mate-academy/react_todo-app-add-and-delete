import React, { useEffect, useRef, useState } from 'react';
import './Header.scss';
import { ErrorMessages } from '../../enums/ErrorMessages';
import { Todo } from '../../types/Todo';
import * as todoService from '../../api/todos';
import classNames from 'classnames';

type Props = {
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;
  setErrorMessage: (message: ErrorMessages) => void;
  tempTodo: Todo | null;
  setTempTodo: (todo: Todo | null) => void;
};

export const Header: React.FC<Props> = ({
  todos,
  setTodos,
  setErrorMessage,
  setTempTodo,
  tempTodo,
}) => {
  const [title, setTitle] = useState('');
  const [isSubmiting, setIsSubmiting] = useState(false);
  const titleInput = useRef(null);

  useEffect(() => {
    if (!isSubmiting) {
      titleInput.current?.focus();
    }
  }, [isSubmiting, todos]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      setErrorMessage(ErrorMessages.EMPTY_TITLE);

      return;
    }

    setIsSubmiting(true);
    if (!tempTodo) {
      setTempTodo({
        id: Math.random(),
        title,
        completed: false,
        userId: todoService.USER_ID,
      });
    }

    todoService
      .createTodo(title.trim())
      .then((newTodo: Todo) => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setTitle('');
      })
      .catch(() => {
        setErrorMessage(ErrorMessages.CREATE_ERROR);
      })
      .finally(() => {
        setTempTodo(null);
        setIsSubmiting(false);
      });
  };

  const isAllTodosComplited = todos.every(todo => todo.completed);

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: isAllTodosComplited,
        })}
        data-cy="ToggleAllButton"
      />

      <form onSubmit={handleSubmit}>
        <input
          ref={titleInput}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={e => setTitle(e.target.value)}
          disabled={isSubmiting}
        />
      </form>
    </header>
  );
};
