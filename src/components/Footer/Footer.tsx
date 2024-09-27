import React, { useContext } from 'react';
import { Context } from '../constext';
import { Filter } from '../Filter';

export const Footer: React.FC = () => {
  const { todos, activeTodos, setForRemove } = useContext(Context);

  const removeCompleted = () => {
    todos.forEach(todo => {
      if (todo.completed) {
        setForRemove(prevForRemove => [...prevForRemove, todo.id]);
      }
    });
  };

  if (todos && todos.length === 0) {
    return null;
  }

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeTodos?.length} items left`}
      </span>

      <Filter />

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!todos?.some(t => t.completed)}
        onClick={removeCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
