import cn from 'classnames';
import { useCallback, useContext, useMemo } from 'react';
import { ErrorMessage, FilterBy } from '../types';
import { deleteTodo } from '../api/todos';
import {
  InputFieldRefContext,
  SetErrorMessageContext,
  SetIsDeletingCompletedContext,
  SetTodosContext,
  TodosContext,
} from '../Contexts';

type Props = {
  filterBy: string;
  handleFilterClick: (e: React.MouseEvent) => void;
};

export const Footer: React.FC<Props> = ({ filterBy, handleFilterClick }) => {
  const todos = useContext(TodosContext);
  const setTodos = useContext(SetTodosContext);
  const setErrorMessage = useContext(SetErrorMessageContext);
  const setIsDeletingCompleted = useContext(SetIsDeletingCompletedContext);
  const inputFieldRef = useContext(InputFieldRefContext);

  const itemsLeftAmount = useMemo(() => {
    return todos.reduce((res, todo) => {
      return todo.completed ? res : res + 1;
    }, 0);
  }, [todos]);

  const handleClearCompletedClick = useCallback(() => {
    setIsDeletingCompleted(true);
    setErrorMessage(ErrorMessage.noError);

    const completedTodos = todos.filter(todo => todo.completed);

    Promise.allSettled(
      completedTodos.map(async todo => {
        try {
          await deleteTodo(todo.id);
          setTodos(prevTodos => {
            return prevTodos.filter(prevTodo => prevTodo.id !== todo.id);
          });
        } catch {
          return setErrorMessage(ErrorMessage.delete);
        }
      }),
    ).finally(() => {
      if (inputFieldRef?.current) {
        inputFieldRef.current.focus();
      }

      setIsDeletingCompleted(false);
    });
  }, [todos, setIsDeletingCompleted, inputFieldRef, setErrorMessage, setTodos]);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${itemsLeftAmount} items left`}
      </span>
      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: filterBy === FilterBy.All,
          })}
          data-cy="FilterLinkAll"
          type="button"
          onClick={handleFilterClick}
        >
          All
        </a>
        <a
          href="#/active"
          className={cn('filter__link', {
            selected: filterBy === FilterBy.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={handleFilterClick}
        >
          Active
        </a>
        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: filterBy === FilterBy.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={handleFilterClick}
        >
          Completed
        </a>
      </nav>
      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={itemsLeftAmount === todos.length}
        onClick={handleClearCompletedClick}
      >
        Clear completed
      </button>
    </footer>
  );
};
