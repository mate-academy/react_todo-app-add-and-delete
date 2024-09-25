import React from 'react';

import { SortBy } from '../../types/SortBy';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { counterActiveTodos } from '../../utils/counterActiveTodos';
import * as todoService from '../../api/todos';
import { showErrorMesage } from '../../utils/showErrorMesage';

type TodosFunction = {
  (todos: Todo[]): void;
  (callback: (currentTodos: Todo[]) => Todo[]): void;
};

type Props = {
  sortFunction: (el: SortBy) => void;
  todos: Todo[];
  howSort: SortBy;
  todosFunction: TodosFunction;
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
  const handleClearCompleted = async () => {
    const completedTodosIds = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    if (completedTodosIds.length === 0) {
      return;
    }

    deletingListFunction(completedTodosIds);
    deletingFunction(true);

    Promise.allSettled(
      completedTodosIds.map(async todoId => {
        try {
          await todoService.deleteTodo(todoId);
          todosFunction((currentTodos: Todo[]) =>
            currentTodos.filter(todo => todo.id !== todoId),
          );
        } catch {
          showErrorMesage('Unable to delete a todo', errorFunction);
        }
      }),
    ).finally(() => {
      deletingListFunction([]);
      deletingFunction(false);
      setTimeout(() => {
        focusInput();
      }, 0);
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
