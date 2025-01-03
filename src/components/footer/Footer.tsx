/* eslint-disable prettier/prettier */
import React from 'react';
import { Todo } from '../../types/Todo';
import { deleteTodos } from '../../api/todos';

interface Props {
  todos: Todo[];
  statusFilter: string;
  setFilterStatus: (status: string) => void;
  setTodoList: (todos: Todo[]) => void;
  setError: (error: string) => void;
}

export const Footer: React.FC<Props> = ({
  todos,
  statusFilter,
  setFilterStatus,
  setTodoList,
  setError
}) => {

  const completedCount = todos.filter(todo => !todo.completed).length;

  const handleDeleteCompletedTodo = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    try {
      await Promise.all(completedTodos.map(todo => deleteTodos(todo.id)));

      setTodoList(todos.filter(todo => !todo.completed));
    } catch {
      setError('Unable to delete a todo');
    }
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${completedCount} items left`}
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={`filter__link ${statusFilter === 'all' ? 'selected' : ''}`}
          data-cy="FilterLinkAll"
          onClick={() => setFilterStatus('all')}
        >
          All
        </a>

        <a
          href="#/active"
          className={`filter__link ${statusFilter === 'active' ? 'selected' : ''}`}
          data-cy="FilterLinkActive"
          onClick={() => setFilterStatus('active')}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={`filter__link ${statusFilter === 'completed' ? 'selected' : ''}`}
          data-cy="FilterLinkCompleted"
          onClick={() => setFilterStatus('completed')}
        >
          Completed
        </a>
      </nav>


      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={handleDeleteCompletedTodo}
        disabled={todos.some(todo => !todo.completed)}
      >
        Clear completed
      </button>
    </footer>
  );
};
