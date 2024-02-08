import React, {
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from 'react';
import classNames from 'classnames';

import { Status } from '../types/Status';
import { Todo } from '../types/Todo';
import { PageContext } from '../utils/GlobalContext';
import { deleteTodo } from '../api/todos';

type Props = {
  setFilteredTodos: Dispatch<SetStateAction<Todo[]>>,
};

export const Footer: React.FC<Props> = ({
  setFilteredTodos,
}) => {
  const [filterStatus, setFilterStatus] = useState(Status.all);
  const {
    todoList,
    setTodoList,
    setError,
    setIsLoading,
    DeletedTodos,
  } = useContext(PageContext);

  const chooseStatus = (status: Status) => {
    let filteredTodos = todoList;

    switch (status) {
      case Status.active:
        filteredTodos = todoList.filter(todo => !todo.completed);
        setFilterStatus(Status.active);
        break;

      case Status.completed:
        filteredTodos = todoList.filter(todo => todo.completed);
        setFilterStatus(Status.completed);
        break;

      default:
        filteredTodos = todoList;
        setFilterStatus(Status.all);
    }

    setFilteredTodos(filteredTodos);
  };

  const finalDelete = () => {
    todoList.filter(todo => todo.completed)
      .forEach(item => {
        DeletedTodos.push(item.id);
        setIsLoading(true);
        deleteTodo(item.id)
          .then(() => setTodoList(todoList.filter(todo => !todo.completed)))
          .catch(() => setError('Unable to delete todo'))
          .finally(() => {
            DeletedTodos.splice(0);
            setIsLoading(false);
          });
      });
  };

  const todoLeft = () => {
    if (todoList) {
      return todoList.filter((todo: Todo) => !todo.completed).length;
    }

    return [];
  };

  const completedTodo = todoList.find((todo: Todo) => todo.completed);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${todoLeft()} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames(
            'filter__link',
            { selected: filterStatus === Status.all },
          )}
          onClick={() => chooseStatus(Status.all)}
          data-cy="FilterLinkAll"
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames(
            'filter__link',
            { selected: filterStatus === Status.active },
          )}
          onClick={() => chooseStatus(Status.active)}
          data-cy="FilterLinkActive"
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames(
            'filter__link',
            { selected: filterStatus === Status.completed },
          )}
          onClick={() => chooseStatus(Status.completed)}
          data-cy="FilterLinkCompleted"
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={finalDelete}
        disabled={!completedTodo}
      >
        Clear completed
      </button>

    </footer>
  );
};
