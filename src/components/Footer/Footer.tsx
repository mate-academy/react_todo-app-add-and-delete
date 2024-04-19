import { useContext } from 'react';
import { FilterContainer } from './components/Filter/Filter';
import { todosContext } from '../../Store';
import { completedTodos } from '../../utils/utils';
import { handleDelete } from '../../utils/handleDelete';
import { TodoWithLoader } from '../../types/TodoWithLoader';

export const Footer: React.FC = () => {
  const { todos, setTodos, setErrorMessage, setUpdatedAt } =
    useContext(todosContext);
  const todosCount = todos.length - completedTodos(todos).length;
  const findCompletedTodos = completedTodos(todos).length > 0;

  function clearCompletedTodos(completedTodos1: TodoWithLoader[]) {
    completedTodos1.map(todo => {
      handleDelete(todo, setTodos, setErrorMessage, setUpdatedAt);
    });
  }

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todosCount} items left
      </span>
      <FilterContainer />

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!findCompletedTodos}
        onClick={() => clearCompletedTodos(completedTodos(todos))}
      >
        Clear completed
      </button>
    </footer>
  );
};
