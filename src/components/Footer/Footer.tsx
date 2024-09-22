import React from 'react';

import { SortBy } from '../../types/SortBy';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { counterActiveTodos } from '../../utils/counterActiveTodos';
import * as todoService from '../../api/todos';
import { showErrorMesage } from '../../utils/showErrorMesage';

type Props = {
  sortFunction: (el: SortBy) => void;
  todos: Todo[];
  howSort: SortBy;
  todosFunction: (todos: Todo[]) => void;
  errorFunction: (el: string) => void;
  focusInput: () => void;
  deletingFunction: (el: boolean) => void;
  deletingListFunction: (ids: number[]) => void;
};

export const Footer: React.FC<Props> = ({
  sortFunction,
  todos,
  howSort,
  todosFunction,
  errorFunction,
  focusInput,
  deletingFunction,
  deletingListFunction,
}) => {
  const handleClearCompleted = () => {
    const completedTodosIds = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    deletingListFunction(completedTodosIds);
    deletingFunction(true);

    Promise.all(completedTodosIds.map(id => todoService.deleteTodo(id)))
      .then(() => {
        const updatedTodos = todos.filter(
          todo => !completedTodosIds.includes(todo.id),
        );

        todosFunction(updatedTodos);

        deletingListFunction([]);
        setTimeout(() => focusInput(), 0);
      })
      .catch(er => {
        showErrorMesage('Unable to delete a todo', errorFunction);
        throw er;
      })
      .finally(() => {
        deletingFunction(false);
      });
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {counterActiveTodos(todos)} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(SortBy).map(enumElement => {
          return (
            <a
              key={enumElement}
              href="#/"
              className={cn('filter__link', {
                selected: howSort === enumElement,
              })}
              data-cy={`FilterLink${enumElement}`}
              onClick={() => sortFunction(enumElement)}
            >
              {enumElement}
            </a>
          );
        })}
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!todos.some(todo => todo.completed)}
        onClick={() => {
          handleClearCompleted();
        }}
      >
        Clear completed
      </button>
    </footer>
  );
};
