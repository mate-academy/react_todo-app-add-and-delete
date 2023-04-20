import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo/TodoInfo';

type Props = {
  todos: Todo[];
  onDelete: (id: number) => void;
};

export const TodoList: React.FC<Props> = ({ todos, onDelete }) => {
  return (
    <>
      {todos.map(todo => (
        <TodoInfo
          todo={todo}
          key={todo.id}
          onDelete={onDelete}
        />
      ))}
    </>
  );
};
