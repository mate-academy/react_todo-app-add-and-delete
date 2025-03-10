import { Todo } from '../types/Todo';

interface Props {
  todos: Todo[];
  newTodo: string;
  setNewTodo: React.Dispatch<React.SetStateAction<string>>;
  handleAdd: (event: React.FormEvent) => Promise<void>;
  isLoading: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
}

export const TodoHeader: React.FC<Props> = ({
  todos,
  handleAdd,
  newTodo,
  setNewTodo,
  isLoading,
  inputRef,
}) => {
  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={`todoapp__toggle-all ${todos.length > 0 && todos.every(todo => todo.completed) ? 'active' : ''}`}
        data-cy="ToggleAllButton"
      />
      <form onSubmit={handleAdd}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodo}
          onChange={event => setNewTodo(event.target.value)}
          disabled={isLoading}
          ref={inputRef}
          autoFocus
        />
      </form>
    </header>
  );
};
