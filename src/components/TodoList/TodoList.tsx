import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[],
  temp: Todo | null,
};

export const TodoList: React.FC<Props> = ({ todos, temp }) => {
  return (
    <>
      {todos.map((todo: Todo) => (
        <TodoItem
          todo={todo}
          key={todo.id}
        />
      ))}

      {temp && <TodoItem todo={temp} isLoading={!!temp} />}
    </>
  );
};
