import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo/TodoInfo';

type Props = {
  todos: Todo[],
  onError: (isError: Error) => void,
  removeTodo: (todoId: number) => void,
  tempTodo: Todo | null;
  todoIdUpdate: number[];
};

export const TodoList: React.FC<Props> = ({
  todos, onError, removeTodo, tempTodo, todoIdUpdate,
}) => {
  return (
    <ul className="todoapp__main">
      {todos.map(todo => (
        <TodoInfo
          key={todo.id}
          todo={todo}
          onError={() => onError}
          removeTodo={removeTodo}
          todoIdUpdate={todoIdUpdate}
        />
      ))}

      {tempTodo && (
        <TodoInfo
          todo={tempTodo}
          onError={() => onError}
          removeTodo={removeTodo}
          todoIdUpdate={todoIdUpdate}
        />
      )}
    </ul>
  );
};
