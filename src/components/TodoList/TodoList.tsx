import React from 'react';

import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  deleteTodo: (todoId: number) => Promise<void>;
  deletingTodoIds: number[];
};

export const TodoList: React.FC<Props> = React.memo(
  ({
    todos,
    tempTodo,
    deleteTodo,
    deletingTodoIds,
  }) => {
    return (
      <section className="todoapp__main" data-cy="TodoList">
        {todos.map(todo => (
          <TodoItem
            todo={todo}
            deleteTodo={deleteTodo}
            isDeletingTodo={deletingTodoIds.includes(todo.id)}
            key={todo.id}
          />
        ))}

        {tempTodo && (
          <TodoItem
            todo={tempTodo}
            deleteTodo={deleteTodo}
            isDeletingTodo={deletingTodoIds.includes(tempTodo.id)}
          />
        )}
      </section>
    );
  },
);
