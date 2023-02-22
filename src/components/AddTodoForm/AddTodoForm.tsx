import React from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  setQuery: (value: string) => void,
  query: string,
  handleSubmit: () => void,
  tempTodo: Todo | null,
};

export const AddTodoForm: React.FC<Props> = ({
  setQuery,
  query,
  handleSubmit,
  tempTodo,
}) => {
  const submitForm = (event: React.FormEvent) => {
    event.preventDefault();
    handleSubmit();
  };

  return (
    <form
      onSubmit={(event) => submitForm(event)}
    >
      <input
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={query}
        onChange={event => setQuery(event.target.value)}
        disabled={!!tempTodo}
      />
    </form>
  );
};
