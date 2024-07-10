import React, { useEffect, useRef, useState } from 'react';
import { USER_ID } from '../../api/todos';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  onSetError: (val: string) => void;
  onTodoDefault: (val: Todo | null) => void;
  onNewTodo: (val: Todo) => Promise<Todo | void>;
};

export const Header: React.FC<Props> = ({
  todos,
  tempTodo,
  onSetError,
  onTodoDefault,
  onNewTodo,
}) => {
  const [value, setValue] = useState('');

  const inputField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputField || tempTodo !== null) {
      inputField.current?.focus();
    }
  }, [tempTodo, todos.length]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!value.trim()) {
      onSetError('Title should not be empty');

      return;
    }

    const newTodo = {
      id: 0,
      userId: USER_ID,
      title: value.trim(),
      completed: false,
    };

    onTodoDefault(newTodo);

    let flag = false;

    onNewTodo(newTodo)
      .catch(() => {
        flag = true;
        onSetError('Unable to add a todo');
      })
      .finally(() => {
        onTodoDefault(null);
        if (!flag) {
          setValue('');
        }
      });
  };

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={value}
          onChange={event => {
            setValue(event.target.value);
          }}
          ref={inputField}
          disabled={!!tempTodo}
        />
      </form>
    </header>
  );
};
