import { useMemo } from 'react';
import { TodoFooterProps } from '../../types/ComponentsProps';
import { TodoFilter } from '../TodoFilter/TodoFilter';

export const Footer: React.FC<TodoFooterProps> = ({
  todoList,
  isClearDisabled,
  filterTodoList,
  clearCompleted,
  updateClearDisabled,
}) => {
  const getItemsLeft = useMemo(() => {
    return todoList.filter(todo => !todo.completed).length;
  }, [todoList]);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {getItemsLeft} items left
      </span>

      <TodoFilter
        todoList={todoList}
        filterTodoList={filterTodoList}
        updateClearDisabled={updateClearDisabled}
      />

      <button
        type="button"
        className="todoapp__clear-completed"
        disabled={isClearDisabled}
        data-cy="ClearCompletedButton"
        onClick={clearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
