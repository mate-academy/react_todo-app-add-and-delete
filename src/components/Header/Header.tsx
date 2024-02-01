/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { USER_ID } from '../../constants/user';
import { addTodos } from '../../api/todos';
import { Todo } from '../../types/Todo';

interface Props {
  onAddTodo: (todo: Todo) => void;
  onError: (error: string) => void;
  onSetTempTodo: (todo: Todo | null) => void;
}

export const Header: React.FC<Props> = ({
  onAddTodo, onError, onSetTempTodo,
}) => {
  const [value, setValue] = useState('');

  const todoInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    todoInput.current?.focus();
  }, []);

  const newTodo = {
    userId: USER_ID,
    title: value.trim(),
    completed: false,
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
      {/* this buttons is active only if there are some active todos */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          ref={todoInput}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </form>
    </header>
  );
};
