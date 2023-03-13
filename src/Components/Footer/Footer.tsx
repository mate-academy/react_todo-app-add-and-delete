import React from 'react';
import { Filters } from '../../types/Filters';
import Filter from '../Filter/Filter';

type Props = {
  filter: Filters;
  todosLength: number;
  completedTodosLength: number;
  changeFilter: (value: Filters) => void;
  removeAllCompletedTodo: () => void;
};

const Footer: React.FC<Props> = ({
  filter,
  changeFilter,
  completedTodosLength,
  todosLength,
  removeAllCompletedTodo: removeAllTodo,
}) => (
  <footer className="todoapp__footer">
    <span className="todo-count">
      {`${todosLength - completedTodosLength} items left`}
    </span>

    <Filter
      filter={filter}
      changeFilter={changeFilter}
    />

    <button
      type="button"
      className="todoapp__clear-completed"
      style={
        {
          visibility: !completedTodosLength
            ? 'hidden'
            : 'visible',
        }
      }
      onClick={removeAllTodo}
    >
      Clear completed
    </button>
  </footer>
);

export default Footer;
