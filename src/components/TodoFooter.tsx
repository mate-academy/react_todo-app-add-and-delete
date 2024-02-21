import classNames from 'classnames';
import React, { useContext } from 'react';
import { Status } from '../types/Status';
import { TodoContext } from '../contexts/TodoContext';
import { ErrorsMessage } from '../types/ErrorsMessage';
import * as TodoClient from '../api/todos';

type Props = {
  activeItems: number;
  completedTodos: number[];
};

export const TodoFooter: React.FC<Props> = ({
  activeItems,
  completedTodos,
}) => {
  const {
    status,
    changeStatus,
    deleteTodo,
    handleSetErrorMessage,
    handleUpdatingTodosIds,
  } = useContext(TodoContext);
  const objectStatusValues = Object.values(Status);

  const handleChangeStatus = (statusValue: Status) => {
    changeStatus(statusValue);
  };

  const handleDeleteCompletedTodos = () => {
    handleSetErrorMessage(ErrorsMessage.None);

    completedTodos.forEach(id => {
      handleUpdatingTodosIds(id);

      TodoClient.deleteTodo(id)
        .then(() => deleteTodo(id))
        .catch(() => handleSetErrorMessage(ErrorsMessage.Delete))
        .finally(() => handleUpdatingTodosIds(null));
    });
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeItems} items left`}
      </span>

      <ul className="filter" data-cy="Filter">
        {objectStatusValues.map(statusValue => (
          <li key={statusValue}>
            <a
              href={`#${statusValue.toLowerCase()}`}
              className={classNames('filter__link', {
                selected: status === statusValue,
              })}
              data-cy={`FilterLink${statusValue}`}
              onClick={() => handleChangeStatus(statusValue)}
            >
              {statusValue}
            </a>
          </li>
        ))}
      </ul>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!completedTodos.length}
        onClick={handleDeleteCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
