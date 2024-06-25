import React from 'react';
import { TodoItem } from '../TodoItem/TodoItem';
import { Todo } from '../../types/Todo';
import { TodoStatus } from '../../types/TodoStatus';
import { FilteredTodos } from '../../utils/FilteredTodos';

type Props = {
  visibleTodos: Todo[];
  tempTodo: Todo | null;
  status: TodoStatus;
  onDelete: (todoId: number) => void;
  loadingTodos: number[];
};

export const TodoList: React.FC<Props> = ({
  visibleTodos,
  tempTodo,
  status,
  onDelete,
  loadingTodos,
}) => {
  const filteredTodos = FilteredTodos(visibleTodos, status);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          isLoading={loadingTodos.includes(todo.id)}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          isLoading={loadingTodos.includes(0)}
          onDelete={() => {}}
        />
      )}
    </section>
  );
};
