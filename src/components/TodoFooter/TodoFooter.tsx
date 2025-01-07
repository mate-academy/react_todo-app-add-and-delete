import React from 'react';
import { Todo } from '../../types/Todo';
import { deleteTodos, getTodos } from '../../api/todos';

interface Props {
  cleanTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setFilter: React.Dispatch<React.SetStateAction<boolean | ''>>;
  setErrorMesage: React.Dispatch<React.SetStateAction<string>>;
  filter: boolean | '';
  todos: Todo[];
}

export const TodoFooter: React.FC<Props> = ({
  cleanTodos,
  setFilter,
  setErrorMesage,
  filter,
  todos,
}) => {
  function cleanCompetedTodo() {
    todos
      .filter(todo => todo.completed)
      .map(todo => {
        if (todo.completed) {
          deleteTodos(todo.id).catch(error => {
            setErrorMesage('Unable to delete a todo');
            throw error;
          });
        }
      });

    getTodos().then(() => cleanTodos(todos.filter(todo => !todo.completed)));
  }

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todos.filter(todo => !todo.completed).length}
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={`filter__link ${filter === '' ? 'selected' : null}`}
          data-cy="FilterLinkAll"
          onClick={() => setFilter('')}
        >
          All
        </a>

        <a
          href="#/active"
          className={`filter__link ${filter === false ? 'selected' : null}`}
          data-cy="FilterLinkActive"
          onClick={() => setFilter(false)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={`filter__link ${filter ? 'selected' : null}`}
          data-cy="FilterLinkCompleted"
          onClick={() => setFilter(true)}
        >
          Completed
        </a>
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!todos.some(todo => todo.completed)}
        onClick={() => cleanCompetedTodo()}
      >
        Clear completed
      </button>
    </footer>
  );
};
