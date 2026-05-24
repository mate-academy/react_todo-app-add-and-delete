import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

interface Props {
  todos: Todo[];
  onRemoveTodo: (todoId: number) => Promise<void>;
  loading: number[];
  tempTodo: Todo | null;
}

export const TodoList: React.FC<Props> = ({
  todos,
  onRemoveTodo,
  loading,
  tempTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          onRemoveTodo={onRemoveTodo}
          loading={loading}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          key={tempTodo.id}
          onRemoveTodo={onRemoveTodo}
          loading={[0]}
        />
      )}
    </section>
  );
};
