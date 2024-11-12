import cn from 'classnames';
import { FC, ReactNode } from 'react';

interface TodoHeaderProps {
  children: ReactNode;
}

export const TodoHeader: FC<TodoHeaderProps> = ({ children }) => {
  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={cn('todoapp__toggle-all', {
          active: false,
        })}
        data-cy="ToggleAllButton"
      ></button>

      {children}
    </header>
  );
};
