import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  loadingTodos: number[];
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  loadingTodos,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoInfo
          key={todo.id}
          todo={todo}
          loadingTodos={loadingTodos}
        />
      ))}

      {tempTodo && <TodoInfo todo={tempTodo} loadingTodos={loadingTodos} />}
    </section>
  );
};
