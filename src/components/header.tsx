import { Todo } from '../types/Todo';

interface HeaderProps {
  todos: Todo[];
  loading: boolean;
  inputRef: React.RefObject<HTMLInputElement> | null;
  newTodoTitle: string;
  setNewTodoTitle: (value: string) => void;
  addTodo: (title: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  todos,
  loading,
  inputRef,
  newTodoTitle,
  setNewTodoTitle,
  addTodo,
}) => {
  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={`todoapp__toggle-all ${todos.every(todo => todo.completed) ? 'active' : ''}`}
        data-cy="ToggleAllButton"
      />

      <form
        onSubmit={e => {
          e.preventDefault();
          if (!loading) {
            addTodo(newTodoTitle);
          }
        }}
      >
        <input
          ref={inputRef}
          name="todo"
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          onChange={e => setNewTodoTitle(e.target.value)}
          disabled={loading}
        />
      </form>
    </header>
  );
};
