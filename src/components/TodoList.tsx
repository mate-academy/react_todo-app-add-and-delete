import React from 'react';
import { Todo } from '../types/Todo';
import { Todos } from './Todos';

interface Props {
  preparedTodos: Todo[];
  setTodos: (value: Todo[]) => void;
  handleError: (value: string) => void;
  tempTodo: Todo | null;
  focusInput: () => void;
}

export const TodoList: React.FC<Props> = ({
  preparedTodos,
  setTodos,
  handleError,
  tempTodo,
  focusInput,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <Todos
        preparedTodos={preparedTodos}
        setTodos={setTodos}
        handleError={handleError}
        tempTodo={tempTodo}
        focusInput={focusInput}
      />
    </section>
  );
};
