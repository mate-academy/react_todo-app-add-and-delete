import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[];
  deleteTodo: (todoId: number) => Promise<void>;
  tempTodo?: Todo | null;
  isAdding?: boolean;
  deletingTodos?: Record<number, boolean>;
};

export const TodoList: React.FC<Props> = React.memo(
  ({
    todos,
    deleteTodo,
    tempTodo = null,
    isAdding = false,
    deletingTodos = {},
  }) => {
    return (
      <section className="todoapp__main" data-cy="TodoList">
        {todos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            deleteTodo={deleteTodo}
            isDeleting={deletingTodos[todo.id]}
          />
        ))}
        {tempTodo && (
          <TodoItem
            todo={tempTodo}
            deleteTodo={deleteTodo}
            isAdding={isAdding}
          />
        )}
      </section>
    );
  },
);

TodoList.displayName = 'TodoList';
