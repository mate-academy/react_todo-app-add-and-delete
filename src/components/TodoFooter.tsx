import React, { useContext } from 'react';
import { TodoContext } from '../context/TodoContext';
import { TodoFilters } from './TodoFilters';

export const TodoFooter: React.FC = () => {
  const { todos, unfinishedTodos, handleClearCompleted } =
    useContext(TodoContext);

  if (todos.length === 0) {
    return null;
  }

  const hasCompletedTodo = todos.some(todo => todo.completed);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${unfinishedTodos.length} items left`}
      </span>

      {/* Chamando o componente de filtros aqui */}
      <TodoFilters />

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={() => handleClearCompleted(todos)}
        disabled={!hasCompletedTodo}
      >
        Clear completed
      </button>
    </footer>
  );
};
