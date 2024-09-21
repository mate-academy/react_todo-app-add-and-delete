import { Todo } from '../types/Todo';

interface HeaderProps {
  todos: Todo[];
  isLoading: boolean;
  inputRef: React.RefObject<HTMLInputElement> | null;
  newTodoTitle: string;
  setNewTodoTitle: (value: string) => void;
  addTodo: (title: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  todos,
  isLoading,
  inputRef,
  newTodoTitle,
  setNewTodoTitle,
  addTodo,
}) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isLoading) {
      addTodo(newTodoTitle);
    }
  };

  const isAllCompleted = todos.every(todo => todo.completed);

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={`todoapp__toggle-all ${isAllCompleted ? 'active' : ''}`}
        data-cy="ToggleAllButton"
      />

      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          name="todo"
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          onChange={e => setNewTodoTitle(e.target.value)}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
