import { Filter } from './Filter';
import { useTodos } from '../utils/TodoContext';

export const Footer: React.FC = () => {
  const { todos, removeTodo } = useTodos();
  const itemsLeft = todos.filter(todo => !todo.completed).length;
  const isCompletedTodos = todos.some(todo => todo.completed);

  const singleOrPlural = itemsLeft === 1;

  const clearCompletedTodos = () => {
    todos
      .filter(todo => todo.completed)
      .forEach(todo => {
        removeTodo(todo.id);
      });
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${itemsLeft} item${singleOrPlural ? '' : 's'} left`}
      </span>

      <Filter />

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!isCompletedTodos}
        onClick={clearCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
