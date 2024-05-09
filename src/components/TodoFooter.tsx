import React from 'react';
import classNames from 'classnames';
import { CompletedStatus } from '../types/CompletedStatus';
import { Todo } from '../types/Todo';
import { removeTodo } from '../utils/removeTodo';

type Props = {
  todos: Todo[];
  onTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  onErrorMessage: (errMessage: string) => void;
  itemsLeft: number;
  filterByStatus: CompletedStatus;
  onFilterByStatus: (status: CompletedStatus) => void;
  onLoadingItemsIds: React.Dispatch<React.SetStateAction<number[]>>;
};

export const TodoFooter: React.FC<Props> = ({
  todos,
  onTodos,
  onErrorMessage,
  itemsLeft,
  filterByStatus,
  onFilterByStatus,
  onLoadingItemsIds,
}) => {
  const completedTodos = todos.filter(todo => todo.completed);

  const handleClearCompletedTodos = () => {
    completedTodos.forEach(completedTodo => {
      const deletedId = completedTodo.id;

      removeTodo({
        deletedId,
        onTodos,
        onErrorMessage,
        onLoadingItemsIds,
      });
    });
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${itemsLeft} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(CompletedStatus).map(status => (
          <a
            data-cy={`FilterLink${status}`}
            key={CompletedStatus[status]}
            href="#/"
            className={classNames('filter__link', {
              selected: filterByStatus === CompletedStatus[status],
            })}
            onClick={() => onFilterByStatus(CompletedStatus[status])}
          >
            {CompletedStatus[status]}
          </a>
        ))}
      </nav>

      <button
        type="button"
        data-cy="ClearCompletedButton"
        className="todoapp__clear-completed"
        disabled={!completedTodos.length}
        onClick={handleClearCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
