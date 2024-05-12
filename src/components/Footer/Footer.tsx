import React from 'react';
import classNames from 'classnames';
import { TypeTodo } from '../../types/Todo';
import { FilterType } from '../../types/FilterType';
import { deleteData } from '../../api/todos';

interface Props {
  todos: TypeTodo[],
  filterType: FilterType,
  setInputFocus: (focus: boolean) => void,
  setFilterType: (type: FilterType) => void,
  setErrorMessage: (message: string) => void,
  setIsLoading: (isLoading: boolean) => void,
  setTodos: React.Dispatch<React.SetStateAction<TypeTodo[]>>,
};

export const Footer: React.FC<Props> = ({
  setFilterType, setInputFocus, filterType,
  todos, setTodos, setErrorMessage, setIsLoading
}) => {

  const handleDeleteCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    setIsLoading(true);
    completedTodos.forEach(todo => {
      deleteData(todo.id)
        .then(() => {
          setTodos(prevTodos =>
            prevTodos.filter(prevTodo => prevTodo.id !== todo.id)
          );
          setIsLoading(false);
          setInputFocus(true);
        })
        .catch(() => {
          setErrorMessage('Unable to delete a todo');

          setTimeout(() => {
            setErrorMessage('');
          }, 3000);
        });
    });
  };

  const notCompletedCount = todos.filter(todo => !todo.completed).length;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {notCompletedCount} item{notCompletedCount === 1 ? '' : 's'} left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames(
            'filter__link',
            { 'selected': filterType === FilterType.All }
          )}
          data-cy="FilterLinkAll"
          onClick={() => setFilterType(FilterType.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames(
            'filter__link',
            { 'selected': filterType === FilterType.Active }
          )}
          data-cy="FilterLinkActive"
          onClick={() => setFilterType(FilterType.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames(
            'filter__link',
            { 'selected': filterType === FilterType.Completed }
          )}
          data-cy="FilterLinkCompleted"
          onClick={() => setFilterType(FilterType.Completed)}
        >
          Completed
        </a>
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={todos.every(todo => !todo.completed)}
        onClick={handleDeleteCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
