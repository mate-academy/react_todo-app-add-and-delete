import React, { useContext } from 'react';
import { Filter } from '../Filter';
import { TodoContext } from '../../context/TodoContext';

export const Footer: React.FC = () => {
  const { todos, setTodos } = useContext(TodoContext);

  const hasEnoughTodos = todos.length > 0;

  const uncompletedTodos = todos.filter(todo => todo.completed === false);

  const hasEnoughCompletedTodo = todos.some(todo => todo.completed === true);

  const handleTodoCleaning = () => {
    setTodos(todos.filter(todo => todo.completed === false));
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      {hasEnoughTodos && (
        <>
          <span className="todo-count" data-cy="TodosCounter">
            {`${uncompletedTodos.length} items left`}
          </span>

          <Filter />

          {/* this button should be disabled if there are no completed todos */}
          <button
            type="button"
            className="todoapp__clear-completed"
            data-cy="ClearCompletedButton"
            onClick={handleTodoCleaning}
            disabled={!hasEnoughCompletedTodo}
          >
            Clear completed
          </button>
        </>
      )}
    </footer>
  );
};
