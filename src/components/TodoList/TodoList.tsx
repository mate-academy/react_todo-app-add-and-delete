import React, { memo } from 'react';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo';

type Props = {
  todos: Todo[];
  onTodoDelete:(todoId: number) => Promise<void>;
  tempTodo: Todo | null;
};

export const TodoList: React.FC<Props> = memo(({
  todos,
  onTodoDelete,
  tempTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoInfo
          todo={todo}
          key={todo.id}
          onDelete={onTodoDelete}
        />
      ))}

      {tempTodo && (
        <TodoInfo
          todo={tempTodo}
          onDelete={onTodoDelete}
          temporary
        />
      )}
    </section>
  );
});
