import React from 'react';
import { Todo } from '../types/Todo';
import { Status } from '../types/Status';
import { ErrorMessage } from '../types/ErrorMessage';
import { deleteTodos } from '../api/todos';

interface Props {
  todos: Todo[];
  selectedStatus: Status;
  setSelectedStatus: (status: Status) => void;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setErrorMessage: (message: string) => void;
  setDeletingIds: React.Dispatch<React.SetStateAction<number[]>>;
}

export const Footer: React.FC<Props> = ({
  todos,
  selectedStatus,
  setSelectedStatus,
  setTodos,
  setErrorMessage,
  setDeletingIds,
}) => {
  const todosLeft = todos.filter(todo => !todo.completed).length;
  const hasCompleted = todos.filter(todo => todo.completed);

  const handleClearCompleted = () => {
    const deletePromis = hasCompleted.map(todo => {
      setDeletingIds(prevIds => [...prevIds, todo.id]);

      return deleteTodos(todo.id)
        .then(() => {
          setTodos(prevTodos => prevTodos.filter(item => item.id !== todo.id));
        })
        .catch(() => {
          setErrorMessage(ErrorMessage.UnableDelete);
        })
        .finally(() => {
          setDeletingIds(prevIds => prevIds.filter(id => id !== todo.id));
        });
    });

    return deletePromis;
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${todosLeft} ${todosLeft === 1 ? 'item' : 'items'} left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={`filter__link ${selectedStatus === Status.All ? 'selected' : ''}`}
          data-cy="FilterLinkAll"
          onClick={() => setSelectedStatus(Status.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={`filter__link ${selectedStatus === Status.Active ? 'selected' : ''}`}
          data-cy="FilterLinkActive"
          onClick={() => setSelectedStatus(Status.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={`filter__link ${selectedStatus === Status.Completed ? 'selected' : ''}`}
          data-cy="FilterLinkCompleted"
          onClick={() => setSelectedStatus(Status.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!hasCompleted.length}
        onClick={handleClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
