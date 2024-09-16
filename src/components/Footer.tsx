import { Filter } from './Filter';
import { useTodos } from '../utils/TodoContext';

export const Footer: React.FC = () => {
  const { todos, removeTodo } = useTodos();
  const todosLeft = todos.filter(todo => !todo.completed).length;
  const isCompletedTodos = todos.some(todo => todo.completed);

  const isSingleItemLeft = todosLeft === 1;

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
        {`${todosLeft} item${isSingleItemLeft ? '' : 's'} left`}
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
