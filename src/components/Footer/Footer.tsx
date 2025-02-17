import React, { useContext } from 'react';
import cn from 'classnames';
import { Status } from '../../types/enums';
import { deleteTodo } from '../../api/todos';
import { TodosContext } from '../TodosContext/TodosContext';

type Props = {
  selected: Status;
  setSelected: (status: Status) => void;
};

export const Footer: React.FC<Props> = ({ selected, setSelected }) => {
  const { todos, setTodos } = useContext(TodosContext);
  const uncompletedTodosAmount = todos.filter(todo => !todo.completed).length;
  const hasCompleted = todos.some(todo => todo.completed);

  const filterTypes = [
    { href: '', status: Status.All, dataCy: 'All' },
    { href: 'active', status: Status.Active, dataCy: 'Active' },
    { href: 'comleted', status: Status.Completed, dataCy: 'Completed' },
  ];

  const handleClearCompleted = () => {
    todos.forEach(todo => {
      if (todo.completed) {
        deleteTodo(todo.id);
      }
    });

    setTodos(todos.filter(todo => !todo.completed));
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {uncompletedTodosAmount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {filterTypes.map(item => {
          const { href, status, dataCy } = item;
          const handleStatusChange = () => {
            setSelected(status);
          };

          return (
            <a
              href={`#/${href}`}
              className={cn('filter__link', {
                selected: selected === status,
              })}
              data-cy={`FilterLink${dataCy}`}
              onClick={handleStatusChange}
              key={dataCy}
            >
              {dataCy}
            </a>
          );
        })}
      </nav>

      {hasCompleted && (
        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
          onClick={handleClearCompleted}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
