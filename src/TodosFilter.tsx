import classNames from 'classnames';
import { Todo } from "./types/Todo"
import { Sort } from './types/Sort';
import { Dispatch, SetStateAction } from 'react';
import { deleteTodos } from './api/todos';

type Props = {
  todos: Todo[],
  setTodos: Dispatch<SetStateAction<Todo[]>>,
  selectedFilter: Sort,
  setSelectedFilter: Dispatch<SetStateAction<Sort>>,
  setErrorMessage: Dispatch<SetStateAction<string>>
}

export const TodosFilter: React.FC<Props> = ({
  todos,
  setTodos,
  selectedFilter,
  setSelectedFilter,
  setErrorMessage,
}) => {
  const unComletedTodo = todos.filter(todo => !todo.completed).length;
  const hasCompletedTodo = todos.some(todo => todo.completed);


  const clearCompletedTodo = () => {
    const completedTodo = todos.filter(todo => todo.completed);

    const completedTodoId = completedTodo.map(todo => todo.id);

    completedTodoId.forEach(item => {
      deleteTodos(item)
        .catch(() => {
          setErrorMessage('Unable to delete a todo');
        });
    });

    const newTodos = todos.filter(todo => !todo.completed);

    setTodos(newTodos);
  }

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {unComletedTodo}
        {' '}
        {unComletedTodo === 1 ? 'item' : 'items'}
        {' '}
        left
      </span>
      
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: selectedFilter === Sort.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => setSelectedFilter(Sort.All)}
        >
          {Sort.All}
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: selectedFilter === Sort.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => setSelectedFilter(Sort.Active)}
        >
          {Sort.Active}
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: selectedFilter === Sort.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setSelectedFilter(Sort.Completed)}
        >
          {Sort.Completed}
        </a>
      </nav>

        <button
          type="button"
          className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={clearCompletedTodo}
        disabled={!hasCompletedTodo}
        >
          Clear completed
        </button>
    </footer>
  );
}
