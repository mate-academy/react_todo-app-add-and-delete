import React, { useEffect, useRef } from 'react';
import { Todo } from '../../types';
import { USER_ID } from '../../api/todos';

interface Props {
  value: string;
  onChangeValue: (val: string) => void;
  isDelCompleted: boolean;
  delTodo: number;
  tempTodo: Todo | null;
  onErrorMessage: (val: string) => void;
  onSubmit: (todo: Todo) => void;
}

export const TodoHeader: React.FC<Props> = ({
  value,
  onChangeValue,
  isDelCompleted,
  delTodo,
  tempTodo,
  onErrorMessage,
  onSubmit,
}) => {
  const titleField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (
      titleField.current &&
      tempTodo === null &&
      Object.is(delTodo, NaN) &&
      isDelCompleted === false
    ) {
      titleField.current.focus();
    }
  }, [tempTodo, delTodo, isDelCompleted]);

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

    onSubmit(newTodo);
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
      <form onSubmit={addingTodo}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={titleField}
          disabled={Boolean(tempTodo)}
          value={value}
          onChange={event => onChangeValue(event.target.value)}
        />
      </form>
    </header>
  );
};
