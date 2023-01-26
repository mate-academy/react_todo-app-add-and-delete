import React, { memo } from 'react';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo/TodoInfo';

type Props = {
  todos: Todo[];
  removeTodo: (todoId: number) => void;
  tempTodo: Todo | null;
  isNewTodoLoading: boolean,
};

export const TodoList: React.FC<Props> = memo(({
  todos,
  removeTodo,
  tempTodo,
  isNewTodoLoading,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoInfo
          todo={todo}
          removeTodo={removeTodo}
          key={todo.id}
        />
      ))}

      {tempTodo && (
        <TodoInfo
          todo={tempTodo}
          removeTodo={removeTodo}
          key={tempTodo?.id}
          isNewTodoLoading={isNewTodoLoading}
        />
      )}
    </section>
  );
});
