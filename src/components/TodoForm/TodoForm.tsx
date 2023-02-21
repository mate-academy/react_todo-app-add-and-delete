import React, { ChangeEvent, FormEvent } from 'react';
import { Error } from '../../types/Error';

type Props = {
  todoTitle: string;
  onTodoTitleChange: (value: string) => void;
  handleErrors: (error: Error) => void;
  addNewTodo: () => void;
  isLoading: boolean;
};

export const TodoForm: React.FC<Props> = (
  {
    todoTitle,
    onTodoTitleChange,
    handleErrors,
    addNewTodo,
    isLoading,
  },
) => {
  const changeTitle = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    onTodoTitleChange(value);
  };

  const onFormSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (todoTitle.trim().length === 0) {
      handleErrors(Error.EMPTY);

      return;
    }

    addNewTodo();

    onTodoTitleChange('');
  };

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        aria-label="Toggle-active"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={onFormSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={isLoading}
          value={todoTitle}
          onChange={changeTitle}
        />
      </form>
    </header>
  );
};
