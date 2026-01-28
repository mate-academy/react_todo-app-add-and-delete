import { Todo } from '../types/Todo';

interface Props {
  todos: Todo[];
}

export const Header: React.FC<Props> = ({ todos }) => {
  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={`todoapp__toggle-all ${todos.every(t => t.completed) ? 'active' : ''}`}
        data-cy="ToggleAllButton"
      />

      <form onSubmit={e => e.preventDefault()}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
        />
      </form>
    </header>
  );
};
