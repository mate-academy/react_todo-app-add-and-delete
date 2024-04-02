import React from 'react';
import { Todos } from './Todos';

interface Props {
  focusInput: () => void;
}

export const TodoList: React.FC<Props> = ({ focusInput }) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <Todos focusInput={focusInput} />
    </section>
  );
};
