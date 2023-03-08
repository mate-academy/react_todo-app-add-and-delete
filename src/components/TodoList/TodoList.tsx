import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  removeTodo: (id:number) => void;
  updatingIds: number[];
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  removeTodo,
  updatingIds,
}) => {
  return (
    <ul className="todoapp__main">
      {todos.map(todo => (
        <TodoInfo
          key={todo.id}
          todo={todo}
          removeTodo={removeTodo}
          updatingIds={updatingIds}
        />
      ))}

      {tempTodo && (
        <TodoInfo
          todo={tempTodo}
          removeTodo={removeTodo}
          updatingIds={updatingIds}
        />
      )}
    </ul>
  );
};
