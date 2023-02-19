import React, { FormEvent } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  title: string,
  onTitleChange: (newTitle: string) => void,
  addTodo: (titleTodo: string) => void,
  tempTodo: Todo | null,
};

export const NewFormTodo: React.FC<Props> = ({
  title,
  onTitleChange,
  addTodo,
  tempTodo,
}) => {
  const isInputVisible = !!tempTodo;
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    addTodo(title);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={title}
        onChange={({ target }) => {
          onTitleChange(target.value);
        }}
        disabled={isInputVisible}
      />
    </form>
  );
};
