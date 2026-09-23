import type { FormEvent, RefObject } from 'react';

type Props = {
  onFormSubmit: (event: FormEvent<HTMLFormElement>) => void;
  query: string;
  onQueryChange: (newQuery: string) => void;
  isLoading: boolean;
  inputRef: RefObject<HTMLInputElement>;
};

export const NewTodoForm = ({
  onFormSubmit,
  query,
  onQueryChange,
  isLoading,
  inputRef,
}: Props) => {
  return (
    <form onSubmit={onFormSubmit}>
      <input
        value={query}
        ref={inputRef}
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        onChange={event => onQueryChange(event.target.value)}
        disabled={isLoading ? true : false}
      />
    </form>
  );
};
