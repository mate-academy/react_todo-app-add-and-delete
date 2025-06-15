import React from 'react';
import cn from 'classnames';

type Props = {
  allCompleted: boolean;
  toggleAllTodos: () => void;
  isLoading: boolean;
};

export const ToggleAll: React.FC<Props> = ({
  allCompleted,
  toggleAllTodos,
  isLoading,
}) => (
  <button
    type="button"
    className={cn('todoapp__toggle-all', { active: allCompleted })}
    data-cy="ToggleAllButton"
    onClick={toggleAllTodos}
    disabled={isLoading}
  />
);
