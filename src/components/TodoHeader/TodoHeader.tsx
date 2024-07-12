import React, { useState } from 'react';
import { Todo } from '../../types';
import { USER_ID } from '../../api/todos';

interface Props {
  titleField: React.RefObject<HTMLInputElement>;
  tempTodo: Todo | null;
  onChangeTempTodo: (val: Todo | null) => void;
  onErrorMessage: (val: string) => void;
  onSubmit: (todo: Todo) => Promise<Todo | void>;
}

export const TodoHeader: React.FC<Props> = ({
  titleField,
  tempTodo,
  onChangeTempTodo,
  onErrorMessage,
  onSubmit,
}) => {
  const [value, setValue] = useState('');

  const addingTodo = (event: React.FormEvent<HTMLElement>) => {
    event.preventDefault();

    if (!value.trim()) {
      onErrorMessage('Title should not be empty');

      return;
    }

    const newTodo = {
      id: 0,
      userId: USER_ID,
      title: value.trim(),
      completed: false,
    };

    let flag = 0;

    onSubmit(newTodo)
      .catch(() => {
        onErrorMessage('Unable to add a todo');
        flag = 1;
      })
      .finally(() => {
        if (flag !== 1) {
          setValue('');
        }

        onChangeTempTodo(null);
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

      <form onSubmit={addingTodo}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={titleField}
          disabled={Boolean(tempTodo)}
          value={value}
          onChange={event => setValue(event.target.value)}
        />
      </form>
    </header>
  );
};
