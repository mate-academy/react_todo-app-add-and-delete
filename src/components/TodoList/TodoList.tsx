import React from 'react';
import { Todo } from '../../types';
import { ErrorType } from '../../types';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  visibleTodos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setError: React.Dispatch<React.SetStateAction<ErrorType>>;
  processingId: number | null;
  setProcessingId: React.Dispatch<React.SetStateAction<number | null>>;
  inputRef: React.RefObject<HTMLInputElement>;
};

export const TodoList: React.FC<Props> = ({
  visibleTodos,
  setTodos,
  setError,
  processingId,
  setProcessingId,
  inputRef,
}) => {
  return (
    <>
      {visibleTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          setTodos={setTodos}
          setError={setError}
          processingId={processingId}
          setProcessingId={setProcessingId}
          inputRef={inputRef}
        />
      ))}
    </>
  );
};
