import React, { useContext } from 'react';
import { TodosContext } from '../TodosProvider';
import { TodoFilter } from '../TodoFilter';

export const Footer: React.FC = () => {
  const { todosFromServer } = useContext(TodosContext);

  const completedTodos = todosFromServer.filter((todo) => todo.completed);
  const todosLeft = todosFromServer.filter((todo) => !todo.completed);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todosLeft.length}
        {' '}
        items left
      </span>
      <TodoFilter />

      {/* don't show this button if there are no completed todos */}

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={completedTodos.length === 0}
      >
        Clear completed
      </button>
    </footer>
  );
};
