import React, { useMemo } from 'react';
import { Todo } from '../../types/Todo';
import { TodoStatus } from '../../types/TodoStatus';
import { TodoItem } from '../Todo';

type Props = {
  todos: Todo[];
  onError: (error: string) => void;
  onListChange: React.Dispatch<React.SetStateAction<Todo []>>;
  tempTodo?: Todo;
  isAdding?: boolean;
  filterStatus: TodoStatus,
};

export const TodoList: React.FC<Props> = React.memo(({
  todos,
  onError,
  onListChange,
  filterStatus,
}) => {
  const visibleTodos = useMemo(() => {
    switch (filterStatus) {
      case TodoStatus.Active:
        return todos.filter(todo => !todo.completed);
      case TodoStatus.Completed:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [filterStatus, todos]);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          onError={onError}
          onListChange={onListChange}
        />
      ))}
    </section>
  );
});
