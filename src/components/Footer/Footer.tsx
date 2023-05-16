import { useContext } from 'react';
import { Filter } from '../Filter';
import { TodosContext } from '../../contexts/TodosContext';

interface Props {
  todosCount: number;
  activeTodosCount: number;
}

export const Footer: React.FC<Props> = ({ todosCount, activeTodosCount }) => {
  const { todos } = useContext(TodosContext);
  const { removeTodo } = useContext(TodosContext);

  const handleClick = () => {
    const todosForDeletingId = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    removeTodo(todosForDeletingId);
  };

  return (
    <footer className="todoapp__footer">
      {activeTodosCount && (
        <span className="todo-count">
          {`${activeTodosCount} items left`}
        </span>
      )}

      <Filter />

      {activeTodosCount !== todosCount && (
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
