import { useContext } from 'react';
import { TodosContext, TodosUpdateContext } from '../../contexts/TodosProvider';
import { TodosFilter } from '../TodosFilter';

export const Footer = () => {
  const { todos } = useContext(TodosContext);
  const { clearCompleted } = useContext(TodosUpdateContext);
  const isSomeTodoCompleted = todos.some(({ completed }) => completed);

  const handleCleanCompletedButtonClicked = () => {
    clearCompleted();
  };

  const uncompletedTodosCount
    = todos.filter(({ completed }) => !completed).length;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${uncompletedTodosCount} items left`}
      </span>

      <TodosFilter />

      <button
        onClick={handleCleanCompletedButtonClicked}
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!isSomeTodoCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
