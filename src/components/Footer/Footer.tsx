import { useContext } from 'react';
import { Filter } from '../Filter';
import { TodosContext } from '../../contexts/TodosContext';

export const Footer: React.FC = () => {
  const { todos } = useContext(TodosContext);
  const { removeTodos } = useContext(TodosContext);

  const handleClick = () => {
    const todosForDeletingId = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    removeTodos(todosForDeletingId);
  };

  const activeTodosCount = todos.filter(todo => !todo.completed).length;

  return (
    <footer className="todoapp__footer">
      {!!activeTodosCount && (
        <span className="todo-count">
          {`${activeTodosCount} items left`}
        </span>
      )}

      <Filter />

      {activeTodosCount !== todos.length && (
        <button
          type="button"
          className="todoapp__clear-completed"
          onClick={handleClick}
        >
          Clear completed
        </button>
      )}

    </footer>
  );
};
