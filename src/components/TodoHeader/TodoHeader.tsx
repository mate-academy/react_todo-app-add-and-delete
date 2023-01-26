/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { memo, useEffect, useRef } from 'react';
import { Todo } from '../../types/Todo';

export type Props = {
  onSubmit: (todo: Omit<Todo, 'id'>) => void
  title: string
  setTitle: (v: string) => void
  showErrorMessage: (v: string) => void
  userId: number
  temporaryTodo: Todo | null
  deleteTodoFromArray: number[]
};

export const TodoHeader: React.FC<Props> = memo(({
  onSubmit,
  title,
  setTitle,
  showErrorMessage,
  userId,
  temporaryTodo,
  deleteTodoFromArray,
}) => {
  const newTodoField = useRef<HTMLInputElement>(null);

  const isActive = temporaryTodo?.id === 0
  || deleteTodoFromArray.length !== 0;

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  const handleTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (title === '') {
      showErrorMessage('Title can\'t be empty');
    } else {
      onSubmit({
        title,
        userId,
        completed: false,
      });
    }

    setTitle('');
  };

  return (
    <header className="todoapp__header">
      <button
        data-cy="ToggleAllButton"
        type="button"
        className="todoapp__toggle-all active"
      />

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          disabled={isActive}
          onChange={handleTitle}
        />
      </form>
    </header>
  );
});
