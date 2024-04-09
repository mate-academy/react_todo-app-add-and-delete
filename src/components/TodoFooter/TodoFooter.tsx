import React from 'react';
import { useTodosContext } from '../../utils/useTodosContext';
import { TodoFilter } from '../TodoFilter';

export const TodoFooter: React.FC = () => {
  const {
    todos,
    activeTodos,
    filterBy,
    setFilterBy,
    completedTodos,
    onTodoDelete,
  } = useTodosContext();

  const handleClearCompleted = () => {
    todos.forEach(todo => {
      if (todo.completed) {
        onTodoDelete(todo.id);
      }
    });
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodos.length} items left
      </span>

      <TodoFilter filterBy={filterBy} setFilterBy={setFilterBy} />

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={handleClearCompleted}
        disabled={!completedTodos.length}
      >
        Clear completed
      </button>
    </footer>
  );
};
