import React from 'react';
import cn from 'classnames';

import { SelectedType } from '../../types/SelectedType';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  selectedOption: SelectedType;
  setSelectedOption: React.Dispatch<React.SetStateAction<SelectedType>>;
  handleDeleteTodo: (todoId: number) => void;
};

export const Footer: React.FC<Props> = ({
  todos,
  selectedOption,
  setSelectedOption,
  handleDeleteTodo,
}) => {
  const filtersOptionName = Object.values(SelectedType);
  const notCompletedCount = todos.filter(todo => !todo.completed).length;
  const completedTodos = todos.filter(todo => todo.completed);

  const deleteCompletedTodos = () => {
    completedTodos.map(todo => handleDeleteTodo(todo.id));
  };

  return (
    <>
      <footer className="todoapp__footer" data-cy="Footer">
        <span className="todo-count" data-cy="TodosCounter">
          {notCompletedCount} items left
        </span>

        <nav className="filter" data-cy="Filter">
          {filtersOptionName.map(filterElement => {
            const filterActiveUrl =
              filterElement === SelectedType.ALL
                ? '#/'
                : `#/${filterElement.toLowerCase()}`;

            return (
              <a
                key={filterElement}
                href={filterActiveUrl}
                className={cn('filter__link', {
                  selected: filterElement === selectedOption,
                })}
                data-cy={`FilterLink${filterElement}`}
                onClick={() => setSelectedOption(filterElement)}
              >
                {filterElement}
              </a>
            );
          })}
        </nav>

        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
          disabled={completedTodos.length === 0}
          onClick={deleteCompletedTodos}
        >
          Clear completed
        </button>
      </footer>
    </>
  );
};
