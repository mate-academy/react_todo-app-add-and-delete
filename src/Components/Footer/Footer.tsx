import { FC } from 'react';
import { TodoFilter } from '../TodoFilter';
import { FilterOption } from '../../enums/FilterOption';
import { Todo } from '../../types/Todo';

interface Props {
  todos: Todo[];
  filterOption: FilterOption;
  setFilterOption: (filterOption: FilterOption) => void;
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
