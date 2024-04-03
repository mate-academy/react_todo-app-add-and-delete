import { FC } from 'react';
import { useTodos } from '../utils/TodosContext';
import { TodoFilter } from './TodoFilter';

export const TodoFooter: FC = () => {
  const { todos, removeTodo } = useTodos();
  const isClearButtonActive = todos.some(todo => todo.completed);
  const countActive = todos.filter(todo => !todo.completed).length;

  const clearAllCompleted = () => {
    todos
      .filter(todo => todo.completed)
      .forEach(todo => {
        removeTodo(todo.id);
      });
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {countActive} items left
      </span>

      <TodoFilter />

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={clearAllCompleted}
        disabled={!isClearButtonActive}
      >
        Clear completed
      </button>
    </footer>
  );
};
