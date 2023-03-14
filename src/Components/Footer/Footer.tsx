import React from 'react';
import { Filters } from '../../types/Filters';
import Filter from '../Filter/Filter';

type Props = {
  filter: Filters;
  todosLength: number;
  completedTodosLength: number;
  onChangeFilter: (value: Filters) => void;
  removeAllCompletedTodo: () => void;
};

const Footer: React.FC<Props> = ({
  filter,
  onChangeFilter,
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
      changeFilter={onChangeFilter}
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
