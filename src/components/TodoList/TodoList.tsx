import React, { memo } from 'react';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo/TodoInfo';

type Props = {
  todos: Todo[];
  onDeleteTodo: (todoId: number) => void;
};

export const TodoList: React.FC<Props> = memo(({ todos, onDeleteTodo }) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map((todo) => (
        <TodoInfo
          todo={todo}
          onDeleteTodo={onDeleteTodo}
        />
      ))}
    </section>
  );
});
