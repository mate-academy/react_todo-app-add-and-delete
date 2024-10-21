import React from 'react';

import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[];
  temptTodo: Todo | null;
  onDeleteTodo: (todoId: number) => void;
  deletingTodoIds: number[];
};

export const TodoList: React.FC<Props> = ({
  todos,
  temptTodo,
  onDeleteTodo,
  deletingTodoIds,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDeleteTodo={onDeleteTodo}
          deletingTodoIds={deletingTodoIds}
        />
      ))}

      {temptTodo && (
        <TodoItem
          todo={temptTodo}
          onDeleteTodo={onDeleteTodo}
          deletingTodoIds={deletingTodoIds}
        />
      )}
    </section>
  );
};
