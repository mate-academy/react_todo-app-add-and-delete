import { title } from 'process';
import React, { FormEvent } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  setQuery: (value: string) => void;
  query: string;
  addTodo: (titleTodo: string) => void;
  tempTodo: Todo | null;
};
export const AddTodoForm: React.FC<Props> = ({
  setQuery,
  query,
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
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
        }}
        disabled={isInputVisible}
      />
    </form>
  );
};
