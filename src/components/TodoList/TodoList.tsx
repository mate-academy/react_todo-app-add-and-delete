import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoTask } from '../Todo/TodoTask';

type Props = {
  todos: Todo[]
};

export const TodoList: React.FC<Props> = ({ todos }) => {
  return (
    <>
      {todos?.map(todo => (
        <TodoTask
          todo={todo}
          key={todo.id}
        />
      ))}
    </>
  );
};
