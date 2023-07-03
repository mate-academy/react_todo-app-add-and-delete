import { FC } from 'react';
import { FilterType } from '../Enums/FilterType';
import { Todo } from '../types/Todo';
import { getNotCompletedTodos } from '../utils/getNotCompletedTodos';
import { TodosFilter } from './TodosFilter';

interface Props {
  todos: Todo[],
  filterType: FilterType,
  setFilterType:React.Dispatch<React.SetStateAction<FilterType>>,
}

export const Footer:FC<Props> = ({ todos, setFilterType, filterType }) => {
  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${getNotCompletedTodos(todos)} items left`}
      </span>

      {/* Active filter should have a 'selected' class */}
      <TodosFilter
        setFilterType={setFilterType}
        currentFilterType={filterType}
      />

      {/* don't show this button if there are no completed todos */}
      <button type="button" className="todoapp__clear-completed">
        Clear completed
      </button>
    </footer>
  );
};
