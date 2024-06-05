import { FC } from 'react';
import { Todo } from '../../types/Todo';

interface Props {
  onAddNewTodo: (title: string) => void;
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  inputRef: React.RefObject<HTMLInputElement>;
  inputLoading: boolean;
  todos: Todo[];
  submit: boolean;
}

export const NewTodo: FC<Props> = ({
  onAddNewTodo,
  query,
  setQuery,
  inputRef,
  // inputLoading,
  submit,
  todos,
}) => {
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onAddNewTodo(query);
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={
          'todoapp__toggle-all ' +
          (todos.every(({ completed }) => completed) ? 'active' : '')
        }
        data-cy="ToggleAllButton"
        title="Toggle All"
      />

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          ref={inputRef}
          placeholder="What needs to be done?"
          value={query}
          onChange={event => setQuery(event.target.value.trimStart())}
          disabled={submit}
        />
      </form>
    </header>
  );
};
