import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface Props {
  visibleTodos: Todo[],
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  setErrorMessage: React.Dispatch<React.SetStateAction<string | null>>,
}

export const TodoList:React.FC<Props> = ({
  visibleTodos,
  setTodos,
  setErrorMessage,
}) => {
  return (
    <div>
      {visibleTodos.map(todo => (
        <TodoItem
          todo={todo}
          setTodos={setTodos}
          setErrorMessage={setErrorMessage}
        />
      ))}
    </div>
  );
};
