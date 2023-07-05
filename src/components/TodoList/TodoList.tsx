import React, { memo } from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[],
  tempTodo: null | Todo,
  onDelete: (todoId: number) => void
  loadingTodoIds: number[]
};

export const TodoList: React.FC<Props> = memo(
  ({
    todos,
    tempTodo,
    onDelete,
    loadingTodoIds,
  }) => (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          onDelete={onDelete}
          key={todo.id}
          isLoading={loadingTodoIds.includes(todo.id)}
        />
      ))}

      {tempTodo && <TodoItem todo={tempTodo} onDelete={onDelete} />}
    </section>

  ),
);
