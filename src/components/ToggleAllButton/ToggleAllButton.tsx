import React from 'react';
import cn from 'classnames';

type Props = {
  value: boolean;
  onToggle: (value: boolean) => void;
};

export const ToggleAllButton: React.FC<Props> = ({ value, onToggle }) => {
  return (
    <button
      type="button"
      className={cn('todoapp__toggle-all', {
        active: value,
      })}
      data-cy="ToggleAllButton"
      onClick={() => onToggle(!value)}
    />
  );
};
