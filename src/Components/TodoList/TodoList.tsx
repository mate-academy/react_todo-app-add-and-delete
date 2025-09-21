import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
  loadingTodoIds: number[];
  onUpdateTodo: (updatedTodo: Todo) => Promise<void>;
  onDeleteTodo: (todoId: number) => void;
}

export const TodoList: React.FC<Props> = ({
  todos,
  loadingTodoIds,
  tempTodo,
  onUpdateTodo,
  onDeleteTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <div>
        {todos.map((todo: Todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            isLoading={loadingTodoIds.some(id => id === todo.id)}
            onUpdateTodo={onUpdateTodo}
            onDeleteTodo={onDeleteTodo}
          />
        ))}

        {tempTodo && (
          <TodoItem
            todo={tempTodo}
            isLoading={loadingTodoIds.some(id => id === tempTodo.id)}
            onUpdateTodo={onUpdateTodo}
            onDeleteTodo={onDeleteTodo}
          />
        )}
      </div>
    </section>
  );
};
