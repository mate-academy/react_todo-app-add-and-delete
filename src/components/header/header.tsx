import React, { useLayoutEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { Error } from '../../types/errors';
import { USER_ID } from '../../api/todos';
import { TodoServiceApi } from '../../utils/todoService';

type Props = {
  areTodosActive: boolean;
  setErrorMessage: (error: string) => void;
  todos: Todo[];
  setTodos: (todos: Todo[] | ((prevTodos: Todo[]) => Todo[])) => void;
  setTempTodo: (tempTodo: Todo | null) => void;
};

export const Header: React.FC<Props> = ({
  areTodosActive,
  setErrorMessage,
  setTodos,
  setTempTodo,
}) => {
  const [todoText, setTodoText] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useLayoutEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    inputRef.current?.focus();
    setIsSubmitting(true);

    const trimmedTodo = todoText.trim();

    if (trimmedTodo.length === 0) {
      setErrorMessage(Error.TITLE);

      return;
    }

    setTempTodo({
      id: 0,
      title: trimmedTodo,
      userId: USER_ID,
      completed: false,
    });

    TodoServiceApi.addTodo(trimmedTodo)
      .then(newTodo => {
        setTodos(prevTodos => [...prevTodos, newTodo]);
        setTodoText('');
      })
      .catch(() => setErrorMessage(Error.POST))
      .finally(() => {
        setIsSubmitting(false);
        setTempTodo(null);
      });
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: areTodosActive,
        })}
        data-cy="ToggleAllButton"
      />

      <form onSubmit={handleFormSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoText}
          onChange={event => setTodoText(event.target.value)}
          disabled={isSubmitting}
          ref={inputRef}
        />
      </form>
    </header>
  );
};
