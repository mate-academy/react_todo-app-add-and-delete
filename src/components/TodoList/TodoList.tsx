import React from 'react';
import { TodoInfo } from '../TodoInfo';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  tempTodo:Todo | null;
  deletingTodo: number[];
  removeTodo: (todoId: number) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  deletingTodo,
  removeTodo,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoInfo
          key={todo.id}
          todo={todo}
          deletingTodo={deletingTodo}
          removeTodo={removeTodo}
        />
      ))}

      {tempTodo && (
        <TodoInfo
          todo={tempTodo}
          deletingTodo={deletingTodo}
          removeTodo={removeTodo}
        />
      )}
    </section>
  );
};
