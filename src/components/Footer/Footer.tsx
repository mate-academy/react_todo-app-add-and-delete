import { memo, useMemo } from 'react';
import { TodosFilter } from '../TodosFilter';
import { ShowTodos } from '../../types/StatusTodo';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[],
  selectedTodos: ShowTodos,
  handleSelectedTodos: (event: React.MouseEvent<HTMLAnchorElement>) => void,
};
export const Footer:React.FC<Props> = memo(({
  todos,
  selectedTodos,
  handleSelectedTodos,
}) => {
  const activeTodosCounter = useMemo(
    () => todos.filter(todo => !todo.completed).length,
    [todos],
  );

  const complitedTodosCounter = useMemo(
    () => todos.filter(todo => todo.completed).length,
    [todos],
  );

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodosCounter === 1
          ? `${activeTodosCounter} item left`
          : `${activeTodosCounter} items left`}
      </span>

      <TodosFilter
        selectedTodos={selectedTodos}
        handleSelectedTodos={handleSelectedTodos}
      />

      {/* don't show this button if there are no completed todos */}
      {complitedTodosCounter > 0 && (
        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
        >
          Clear completed
        </button>
      )}
    </footer>
  );
});
