import React from 'react';
import { Todo } from '../types/Todo';
import { Status } from './status';
import { deleteTodos } from '../api/todos';
import { ErrorMessage } from './errorsMessage';
import cn from 'classnames';

interface Props {
  posts: Todo[];
  filterStatus: (status: Status) => void;
  status: Status;
  setErrorMessage: (errorMessage: ErrorMessage) => void;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  todoTemplate: Todo | null;
}

export const FooterPart: React.FC<Props> = ({
  posts,
  filterStatus,
  status,
  setTodos,
  todoTemplate,
  setErrorMessage,
}) => {
  const count = posts.filter(
    value => !value.completed && todoTemplate != value && value.id != 0,
  ).length;
  const deleteComplete = () => {
    posts.map(value => {
      if (value.completed) {
        deleteTodos(value.id)
          .then(() => {
            setTodos(currentTodos =>
              currentTodos.filter(todo => todo.id !== value.id),
            );
          })
          .catch(() => {
            setErrorMessage(ErrorMessage.deleteError);
            setTimeout(() => {
              setErrorMessage(ErrorMessage.noError);
            }, 3000);
          });
      }
    });
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {count} items left
      </span>
      <nav className="filter" data-cy="Filter">
        {Object.values(Status).map(val => (
          <a
            key={val}
            href={`#/${val.toLowerCase()}`}
            className={cn('filter__link', {
              selected: status === val,
            })}
            data-cy={`FilterLink${val}`}
            onClick={() => filterStatus(val)}
          >
            {val}
          </a>
        ))}
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!posts.find(element => element.completed)}
        onClick={deleteComplete}
      >
        Clear completed
      </button>
    </footer>
  );
};
