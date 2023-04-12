import { FC } from 'react';
import { TodoFilter } from '../TodoFilter';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[],
  filterBy: string,
  setFilterBy: (string: string) => void,
};

export const Footer:FC<Props> = ({
  todos,
  filterBy,
  setFilterBy,
}) => {
  const completedTodos = () => {
    return todos.some(todo => todo.completed === true);
  };

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${todos.length} items left`}
      </span>

      <TodoFilter
        setFilterBy={setFilterBy}
        filterBy={filterBy}
      />

      <button
        type="button"
        className="todoapp__clear-completed"
        style={{
          opacity: completedTodos() ? 1 : 0,
          cursor: completedTodos() ? 'pointer' : 'default',
        }}
      >
        Clear completed
      </button>
    </footer>
  );
};
