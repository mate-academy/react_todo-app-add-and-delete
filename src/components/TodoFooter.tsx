import React from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';
import { FilterType } from '../types/FooterFilter';
import { deleteTodo } from '../api/todos';
import { ErrorTitle } from '../types/TodoErrors';

type Props = {
  todos: Todo[];
  setViewTodos: (value: string) => void;
  viewTodos: string;
  setToodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setErrorMessage(val: string): void;
  setLoader: React.Dispatch<React.SetStateAction<Record<number, boolean>>>;
};

const TodoFooter: React.FC<Props> = ({
  todos,
  setViewTodos,
  viewTodos,
  setToodos,
  setErrorMessage,
  setLoader,
}) => {
  const countOpenTodo = todos.reduce((acc, todo) => {
    if (!todo.completed) {
      return acc + 1;
    }

    return acc;
  }, 0);

  const findCompleted = todos.some((todo) => todo.completed);

  function handlerClearCompleted() {
    const completedTodos = todos.filter((todo) => todo.completed);

    Promise.all(
      completedTodos.map((todo) => {
        setLoader((prevLoader) => ({
          ...prevLoader,
          [todo.id]: true,
        }));

        return deleteTodo(todo.id)
          .then(() => {
            setToodos((currentTodos) => {
              const updatedTodos = currentTodos.filter(
                (currentTodo) => currentTodo.id !== todo.id,
              );

              return updatedTodos;
            });
          })
          .catch(() => setErrorMessage(ErrorTitle.Delete))
          .finally(() => {
            setLoader((prevLoader) => ({
              ...prevLoader,
              [todo.id]: false,
            }));
          });
      }),
    );
  }

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${countOpenTodo} items left`}
      </span>

      {/* Active filter should have a 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          onClick={() => setViewTodos(FilterType.All)}
          href="#/"
          className={cn('filter__link ', {
            selected: viewTodos === FilterType.All,
          })}
          data-cy="FilterLinkAll"
        >
          All
        </a>

        <a
          onClick={() => setViewTodos(FilterType.Active)}
          href="#/active"
          className={cn('filter__link ', {
            selected: viewTodos === FilterType.Active,
          })}
          data-cy="FilterLinkActive"
        >
          Active
        </a>

        <a
          onClick={() => setViewTodos(FilterType.Completed)}
          href="#/completed"
          className={cn('filter__link ', {
            selected: viewTodos === FilterType.Completed,
          })}
          data-cy="FilterLinkCompleted"
        >
          Completed
        </a>
      </nav>

      {/* don't show this button if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!findCompleted}
        onClick={handlerClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};

export default TodoFooter;
