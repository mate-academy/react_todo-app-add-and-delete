import React, { memo } from 'react';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo/TodoInfo';

interface Props {
  todos: Todo[],
  removeTodo: (todoId: number) => Promise<void>,
  tempTodo: Todo | null,
}

export const TodoList: React.FC<Props> = memo(({
  todos,
  removeTodo,
  tempTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map((todo) => (
        <TodoInfo todo={todo} key={todo.id} removeTodo={removeTodo} />
      ))}

      {tempTodo && (
        <TodoInfo
          todo={tempTodo}
          removeTodo={removeTodo}
        />
      )}
    </section>
  );
});
