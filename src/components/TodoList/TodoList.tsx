import React, { useCallback, useState, useMemo } from 'react';
import { Todo } from '../../types/Todo';
import { TodoStatus } from '../../types/TodoStatus';

import { TodoInfo } from '../TodoInfo/TodoInfo';
import { TodoFilter } from '../TodoFilter/TodoFilter';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  isAdding: boolean;
  onDelete: (id: number) => void;
  deletingIds: number[];
};

export const TodoList: React.FC<Props> = React.memo(({
  todos,
  tempTodo,
  isAdding,
  onDelete,
  deletingIds,
}) => {
  const [status, setStatus] = useState<TodoStatus>(TodoStatus.ALL);

  const filterTodos = () => {
    let filtered;

    switch (status) {
      case TodoStatus.ACTIVE:
      case TodoStatus.COMPLETED:
        filtered = todos.filter(todo => (
          (status === TodoStatus.ACTIVE)
            ? !todo.completed
            : todo.completed
        ));
        break;
      default:
        filtered = todos;
    }

    return filtered;
  };

  const filteredTodos = useMemo(() => filterTodos(), [todos, status]);

  const handleChangeStatus = useCallback((todosStatus: TodoStatus) => {
    setStatus(todosStatus);
  }, []);

  const complitedTodos = useMemo(
    () => todos.filter(todo => todo.completed), [todos],
  );
  const activeTodos = useMemo(
    () => todos.filter(todo => !todo.completed), [todos],
  );

  const deleteComplitedTodos = useCallback(() => {
    if (complitedTodos.length !== 0) {
      complitedTodos.forEach(todo => onDelete(todo.id));
    }
  }, [complitedTodos]);

  return (
    <>
      <section className="todoapp__main" data-cy="TodoList">
        {filteredTodos.map(todo => (
          <TodoInfo
            todo={todo}
            key={todo.id}
            onDelete={onDelete}
            deletingIds={deletingIds}
          />
        ))}

        {(isAdding && tempTodo) && (
          <TodoInfo
            todo={tempTodo}
            onDelete={onDelete}
            deletingIds={deletingIds}
          />
        )}
      </section>

      <footer className="todoapp__footer" data-cy="Footer">
        <span className="todo-count" data-cy="todosCounter">
          {`${activeTodos.length} items left`}
        </span>

        <TodoFilter
          onChangeFilter={handleChangeStatus}
          status={status}
        />

        <button
          data-cy="ClearCompletedButton"
          type="button"
          className="todoapp__clear-completed"
          style={(complitedTodos.length === 0)
            ? { visibility: 'hidden' }
            : {}}
          onClick={deleteComplitedTodos}
        >
          Clear completed
        </button>
      </footer>
    </>
  );
});
