import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';
import { Errors } from '../../types/Errors';
import { USER_ID } from '../../api/todos';
import { client } from '../../utils/fetchClient';

type Props = {
  todos: Todo[];
  setErrorMessage: (value: Errors | string) => void;
  setTodos: (action: (prev: Todo[]) => Todo[]) => void;
  setTempTodo: (todo: Todo | null) => void;
};

export const Header: React.FC<Props> = ({
  todos,
  setErrorMessage,
  setTodos,
  setTempTodo,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState('');
  const inputTodo = useRef<HTMLInputElement>(null);

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setErrorMessage(Errors.Title);
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);

      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');
    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    });

    try {
      const newTodo = await client.post<Todo>(`/todos`, {
        userId: USER_ID,
        title: trimmedTitle,
        completed: false,
      });

      setTodos(prev => [...prev, newTodo]);
      setTitle('');
    } catch {
      setErrorMessage(Errors.UnableTodo);
      setTimeout(() => setErrorMessage(''), 3000);
    } finally {
      setTempTodo(null);
      setIsSubmitting(false);
      setTimeout(() => {
        inputTodo.current?.focus();
      }, 0);
    }
  };

  const handleTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  useEffect(() => {
    inputTodo.current?.focus();
  }, []);

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: todos.length > 0 && todos.every(todo => todo.completed),
        })}
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          ref={inputTodo}
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={handleTitle}
          disabled={isSubmitting}
        />
      </form>
    </header>
  );
};
