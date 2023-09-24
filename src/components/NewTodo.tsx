/* eslint-disable max-len */
/* eslint-disable jsx-a11y/no-autofocus */
import { ChangeEvent } from 'react';

interface Props {
  query: string;
  onQueryChange: (value: string) => void;
  loadingTodosIds: number[],
  onSubmit: (event: React.FormEvent) => void,
}

// eslint-disable-next-line max-len
export const NewTodo: React.FC<Props> = ({
  query, onQueryChange, loadingTodosIds, onSubmit,
}) => {
  return (
    /* Add a todo on form submit */
    <form onSubmit={onSubmit}>
      <input
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={query}
        onChange={(event: ChangeEvent<HTMLInputElement>) => onQueryChange(event.target.value)}
        disabled={loadingTodosIds.includes(0)}
      />
    </form>
  );
};
