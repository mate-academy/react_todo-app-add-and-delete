import React from 'react';
import { Todo } from '../../types';
import { ErrorType } from '../../types';
import { TodoList } from '../TodoList/TodoList';

type Props = {
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setError: React.Dispatch<React.SetStateAction<ErrorType>>;
  visibleTodos: Todo[];
  processingId: number | null;
  setProcessingId: React.Dispatch<React.SetStateAction<number | null>>;
  inputRef: React.RefObject<HTMLInputElement>;
};

export const Section: React.FC<Props> = ({
  setTodos,
  setError,
  visibleTodos,
  processingId,
  setProcessingId,
  inputRef,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TodoList
        visibleTodos={visibleTodos}
        setTodos={setTodos}
        setError={setError}
        processingId={processingId}
        setProcessingId={setProcessingId}
        inputRef={inputRef}
      />
    </section>
  );
};
