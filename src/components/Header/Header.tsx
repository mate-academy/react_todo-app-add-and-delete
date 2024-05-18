import { Todo } from '../../types/Todo';

interface Props {
  todos: Todo[];
  addTodo: (newTodoTitle: string) => void;
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  inputLoading: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
}

export const Header: React.FC<Props> = ({
  todos, 
  addTodo, 
  inputLoading, 
  query, 
  setQuery,
  inputRef,
 }) => {

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTodo(query);
  };

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className={
          'todoapp__toggle-all ' +
          (todos.every(({ completed }) => completed) ? 'active' : '')
        }
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputRef}
          value={query}
          onChange={e => setQuery(e.target.value)}
          disabled={inputLoading}
        />
      </form>
    </header>
  );
};