import React from 'react';

import type { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[],
  tempTodo: Todo | null,
  onDelete: (id: number) => Promise<number | void>;
  processingTodoIds: number[];
};

export const TodoList: React.FC<Props> = React.memo((props) => {
  const {
    todos,
    tempTodo,
    onDelete,
    processingTodoIds,
  } = props;

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          onDelete={onDelete}
          key={todo.id}
          hasLoader={processingTodoIds.includes(todo.id)}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          onDelete={onDelete}
          hasLoader
        />
      )}
    </section>
  );
});
