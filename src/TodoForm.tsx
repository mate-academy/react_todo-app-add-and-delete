import { FormEvent } from 'react';
import { Todo } from './types/Todo';

interface TodoFormProps {
  createTodo: (event: FormEvent) => Promise<void>,
  query: string,
  setQuery: (query: string) => void,
  temporaryTodo: Todo | null,
}

export const TodoForm = (
  {
    createTodo, query, setQuery, temporaryTodo,
  }: TodoFormProps,
) => {
  return (
    <form onSubmit={createTodo}>
      <input
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        disabled={!!temporaryTodo}
      />
    </form>
  );
};
