import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

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
        <TodoItem
          todo={todo}
          removeTodo={removeTodo}
          loadingTodo={loadingTodo}
        />
      ))}

      {tempoTodo && (
        <TodoItem
          todo={tempoTodo}
          removeTodo={removeTodo}
          loadingTodo={loadingTodo}
        />
      )}
    </ul>
  );
};
