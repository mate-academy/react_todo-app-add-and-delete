import { useContext } from 'react';
import { FilterTodos } from '../FilterTodos';
import { TodosContext } from '../../context/TodosContext';

export const Footer = () => {
  const { todos } = useContext(TodosContext);

  const isVissible = todos.some(todo => todo.completed);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${todos.filter(todo => !todo.completed).length} items left`}
      </span>

      <FilterTodos />

      {isVissible && (
        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
