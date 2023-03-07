import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  removeTodo: (id:number) => void;
  updatingId: number[];
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  removeTodo,
  updatingId,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoInfo
          key={todo.id}
          todo={todo}
          removeTodo={removeTodo}
          updatingId={updatingId}
        />
      ))}

      {tempTodo && (
        <TodoInfo
          todo={tempTodo}
          removeTodo={removeTodo}
          updatingId={updatingId}
        />
      )}
    </section>
  );
};
