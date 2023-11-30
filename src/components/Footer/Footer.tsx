import { useContext } from 'react';
import { TodosContext } from '../TodosContext/TodosContext';
import { getNumberActiveTodo } from '../../utils/getNumberActiveTodo';
import { TodosFilter } from '../TodosFilter/TodosFilter';

export const Footer = () => {
  const { todos, setTodos } = useContext(TodosContext);

  const handleDeleteCompleted = () => {
    const newTodos = todos.filter(todo => !todo.completed);

    setTodos(newTodos);
  };

  const isClearButtonVisible = todos.some(todo => todo.completed);
  const countTodosActive = getNumberActiveTodo(todos);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${countTodosActive} item${countTodosActive !== 1 ? 's' : ''} left`}
      </span>

      <TodosFilter />

      {isClearButtonVisible && (
        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
          onClick={handleDeleteCompleted}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
