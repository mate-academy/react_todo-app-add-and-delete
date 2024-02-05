/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { USER_ID } from '../../constants/user';
import { Todo } from '../../types/Todo';
import { addTodos } from '../../api/todos';

type Props = {
  onError: (error: string) => void;
  onSetTempTodo: (todo: Todo | null) => void;
  onAddTodo: (todo: Todo) => void;
};

export const Header: React.FC<Props> = ({
  onError,
  onSetTempTodo,
  onAddTodo,
}) => {
  const [value, setValue] = useState('');

  const todoInput = useRef<HTMLInputElement>(null);

  const newTodo = {
    usedId: USER_ID,
    title: value.trim(),
    completed: false,
  };

  useEffect(() => {
    todoInput.current?.focus();
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onError('');

    if (!value.trim()) {
      onError('Title should not be empty');

      return;
    }

    todoInput.current?.setAttribute('disabled', 'true');

    onSetTempTodo({ ...newTodo, id: 0 });
    addTodos(newTodo)
      .then((todo) => {
        onAddTodo(todo);
        setValue('');
      })
      .catch(() => {
        onError('Unable to add a todo');
      })
      .finally(() => {
        todoInput.current?.removeAttribute('disabled');
        todoInput.current?.focus();
        onSetTempTodo(null);
      });
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      <form onSubmit={handleSubmit}>
        <input
          ref={todoInput}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
      </form>
    </header>
  );
};
