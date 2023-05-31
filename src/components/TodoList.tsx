import React from 'react';
import { TodoInfo } from './TodoInfo';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[],
  tempoTodo: Todo | null,
  loadingTodo: number[];
  removeTodo: (id: number) => void,
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempoTodo,
  loadingTodo,
  removeTodo,
}) => {
  return (
    <ul className="todoapp__main" data-cy="TodoList">
      {todos.map((todo) => (
        <TodoInfo
          todo={todo}
          removeTodo={removeTodo}
          loadingTodo={loadingTodo}
        />
      ))}

      {tempoTodo && (
        <TodoInfo
          todo={tempoTodo}
          removeTodo={removeTodo}
          loadingTodo={loadingTodo}
        />
      )}
    </ul>
  );
};
