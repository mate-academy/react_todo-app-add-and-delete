import React, { useEffect, useState } from 'react';
import { Todo } from '../../types/Todo';
import { TodoStatus } from '../../types/TodoStatus';

import { TodoInfo } from '../TodoInfo';
import { TodoFilter } from '../TodoFilter';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  isAdding: boolean;
  onDelete: (id: number) => void;
  deletingIds: number[];
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  isAdding,
  onDelete,
  deletingIds,
}) => {
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
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

  useEffect(() => {
    setFilteredTodos(filterTodos());
  }, [todos, status]);

  const handleChangeStatus = (todosStatus: TodoStatus) => {
    setStatus(todosStatus);
  };

  const complitedTodos = todos.filter(todo => todo.completed);
  const activeTodos = todos.filter(todo => !todo.completed);

  const deleteComplitedTodos = () => {
    if (complitedTodos.length !== 0) {
      complitedTodos.forEach(todo => onDelete(todo.id));
    }
  };

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
};
