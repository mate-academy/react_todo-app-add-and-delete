import { FC } from 'react';
import { TodoFilter } from '../TodoFilter';
import { FilterOptions } from '../../enums/FilterOptions';
import { Todo } from '../../types/Todo';

interface Props {
  todos: Todo[];
  filterOption: FilterOptions;
  setFilterOption: (filterOption: FilterOptions) => void;
  removeCompleted: () => void;
}

export const Footer: FC<Props> = ({
  todos,
  filterOption,
  setFilterOption,
  removeCompleted,
}) => {
  const completedTodos = todos.filter((todo) => todo.completed);
  const activeTodos = todos.filter((todo) => !todo.completed);

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${activeTodos.length} items left`}
      </span>

      <TodoFilter
        filterOption={filterOption}
        setFilterOption={setFilterOption}
      />

      <button
        type="button"
        className="todoapp__clear-completed"
        disabled={completedTodos.length === 0}
        onClick={removeCompleted}
      >
        Clear completed
      </button>

    </footer>
  );
};
