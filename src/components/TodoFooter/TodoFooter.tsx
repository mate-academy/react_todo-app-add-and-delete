import { memo, useMemo } from 'react';
import { TodosFilter } from '../TodosFilter';
import { TodoFilter } from '../../types/TodoFilter';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[],
  selectedTodos: TodoFilter,
  handleSelectedTodos: (event: React.MouseEvent<HTMLAnchorElement>) => void,
  removeComplitedTodos: () => void,
};

export const Footer:React.FC<Props> = memo(({
  todos,
  selectedTodos,
  handleSelectedTodos,
  removeComplitedTodos,
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
        {`${activeTodosCounter} items left`}
      </span>

      <TodosFilter
        selectedTodos={selectedTodos}
        handleSelectedTodos={handleSelectedTodos}
      />

      {complitedTodosCounter > 0 && (
        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
          onClick={removeComplitedTodos}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
});
