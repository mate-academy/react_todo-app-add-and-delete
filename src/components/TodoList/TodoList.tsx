import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo/TodoInfo';

interface Props {
  todos: Todo[];
  onDeleteTodo: (todoId: number) => void;
  loadingTodosIds: number[];
}

export const TodoList: React.FC<Props> = React.memo(({
  todos,
  onDeleteTodo,
  loadingTodosIds,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoInfo
          key={todo.id}
          todo={todo}
          onDeleteTodo={onDeleteTodo}
          loadingTodosIds={loadingTodosIds}
        />
      ))}
    </section>
  );
});
