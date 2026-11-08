import cn from 'classnames';
import './Footer.scss';
import '../../styles/filter.scss';
import { FilterStatus } from '../../types/FilterStatus';
import { Todo } from '../../types/Todo';
import { deleteTodo } from '../../api/todos';
import { Dispatch, SetStateAction } from 'react';
import { ErrorType } from '../../types/ErrorType';

const filters = [
  {
    status: FilterStatus.All,
    href: '#/',
    title: 'All',
    dataCy: 'FilterLinkAll',
  },
  {
    status: FilterStatus.Active,
    href: '#/active',
    title: 'Active',
    dataCy: 'FilterLinkActive',
  },
  {
    status: FilterStatus.Completed,
    href: '#/completed',
    title: 'Completed',
    dataCy: 'FilterLinkCompleted',
  },
];

type Props = {
  todos: Todo[];
  filterStatus: FilterStatus;
  setFilterStatus: (status: FilterStatus) => void;
  setTodos: Dispatch<SetStateAction<Todo[]>>;
  setErrorType: (ErrorType: ErrorType) => void;
};

export const Footer = ({
  todos,
  filterStatus,
  setFilterStatus,
  setTodos,
  setErrorType,
}: Props) => {
  const todosCounter = () => {
    const activeTodos = todos?.filter(todo => !todo.completed);

    return activeTodos?.length;
  };

  const handleClearCompleted = async () => {
    const completed = todos.filter(todo => todo.completed);

    setErrorType(null);

    const result = await Promise.allSettled(
      completed.map(todo => deleteTodo(todo.id)),
    );

    const success = completed
      .filter((_, index) => result[index].status === 'fulfilled')
      .map(todo => todo.id);

    setTodos(currentTodos =>
      currentTodos.filter(todo => !success.includes(todo.id)),
    );

    if (result.some(res => res.status === 'rejected')) {
      setErrorType('delete');
    }
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${todosCounter()} items left`}
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        {filters.map(filter => (
          <a
            key={filter.status}
            href={filter.href}
            className={cn('filter__link', {
              selected: filterStatus === filter.status,
            })}
            data-cy={filter.dataCy}
            onClick={() => setFilterStatus(filter.status)}
          >
            {filter.title}
          </a>
        ))}
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={todos.every(todo => !todo.completed)}
        onClick={() => handleClearCompleted()}
      >
        Clear completed
      </button>
    </footer>
  );
};
