import React from 'react';
import cn from 'classnames';
import { FilterStatusType } from '../../types/FilterStatusType';
import { Todo } from '../../types/Todo';
import { ErrorMessage } from '../../types/ErrorStatusType';
import { deleteTodo } from '../../api/todos';

type FooterProps = {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  filterStatus: FilterStatusType;
  setFilterStatus: (filterStatus: FilterStatusType) => void;
  completedTodoExists: boolean;
  numberOfNotCompletedTodos: number;
  setTodoIdsToDelete: (todoIds: number[]) => void;
  setErrorMessage?: (errorMessage: ErrorMessage) => void;
};

export const Footer: React.FC<FooterProps> = ({
  filterStatus,
  setFilterStatus,
  completedTodoExists,
  numberOfNotCompletedTodos,
  todos,
  setTodos,
  setTodoIdsToDelete,
  setErrorMessage,
}) => {
  const handleChangeFilterStatus = (filterStatusType: FilterStatusType) => {
    setFilterStatus(filterStatusType);
  };

  const handleClearCompleted = () => {
    const completedTodosIds = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    setTodoIdsToDelete(completedTodosIds);

    Promise.allSettled(
      completedTodosIds.map(todoId => {
        return deleteTodo(todoId).then(() => todoId);
      }),
    )
      .then(results => {
        const deletedIds = results
          .filter(result => result.status === 'fulfilled')
          .map(result => result.value);

        const notDeletedIds = results.some(
          result => result.status === 'rejected',
        );

        if (notDeletedIds) {
          if (setErrorMessage) {
            setErrorMessage(ErrorMessage.DeleteTodo);
          }
        }

        if (setTodos) {
          setTodos(currentTodos =>
            currentTodos.filter(todoItem => !deletedIds.includes(todoItem.id)),
          );
        }
      })
      .finally(() => {
        setTodoIdsToDelete([]);
      });
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${numberOfNotCompletedTodos} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(FilterStatusType).map(status => (
          <a
            key={status}
            href={`#/${status.toLowerCase()}`}
            className={cn('filter__link', {
              selected: filterStatus === status,
            })}
            data-cy={`FilterLink${status}`}
            onClick={() => handleChangeFilterStatus(status)}
          >
            {status}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!completedTodoExists}
        onClick={handleClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
