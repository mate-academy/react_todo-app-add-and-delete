import React, { useContext } from 'react';
import { Filter } from '../Filter/Filter';
import { TodosContext } from '../TododsContext/TodosContext';
import { deleteTodo } from '../../api/todos';

export const Footer: React.FC = () => {
  const { todos, setTodos } = useContext(TodosContext);

  const countActiveTodos = todos.filter(todo => !todo.completed).length;
  const countCompletedTodos = todos.some(todo => todo.completed);

  const handleClearCompleted = () => {
    const newTodos = todos.filter(todo => {
      if (todo.completed) {
        deleteTodo(todo.id);
      }

      return !todo.completed;
    });

    setTodos(newTodos);
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${countActiveTodos} item${countActiveTodos > 1 ? 's' : ''} left`}
      </span>

      <Filter />
      {/* don't show this button if there are no completed todos */}
      {countCompletedTodos && (
        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
          onClick={handleClearCompleted}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
