import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[],
  temp: Todo | null,
  updateLoading: React.Dispatch<React.SetStateAction<boolean>>,
  updateError: React.Dispatch<React.SetStateAction<string>>,
};

export const TodoList: React.FC<Props> = ({
  todos,
  temp,
  updateLoading,
  updateError,
}) => {
  return (
    <>
      {todos.map((todo: Todo) => (
        <TodoItem
          todo={todo}
          key={todo.id}
          updateLoading={updateLoading}
          updateError={updateError}
        />
      ))}

      {temp && (
        <TodoItem
          todo={temp}
          isLoading={!!temp}
          updateLoading={updateLoading}
          updateError={updateError}
        />
      )}
    </>
  );
};
