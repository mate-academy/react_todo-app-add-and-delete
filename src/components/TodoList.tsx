import { FC, memo } from 'react';
import React from 'react';

type Props = {
  children: React.ReactNode;
};

export const TodoList: FC<Props> = memo(({ children }) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {children}
    </section>
  );
});

TodoList.displayName = 'TodoListMemo';
