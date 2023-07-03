import React, { FC, memo } from 'react';
import { Todo as TodoType } from '../types/Todo';
import { Todo } from './Todo';

type Props = {
  todos: TodoType[];
  removeTodo: (id: number) => void;
  tempTodo: TodoType | null;
};

export const TodoList: FC<Props> = memo(({ todos, removeTodo, tempTodo }) => {
  return (
    <ul className="todoapp__main">
      {todos?.map(todo => (
        <Todo
          key={todo.id}
          todo={todo}
          removeTodo={removeTodo}
        />
      ))}

      {tempTodo && (
        <Todo
          todo={tempTodo}
          removeTodo={removeTodo}
        />
      )}
    </ul>
  );
});
