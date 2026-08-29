import React from 'react';
import classNames from 'classnames';

type Props = {
  areAllCompleted: boolean;
  onToggleAll: () => void;
};

export const ToggleAllButton: React.FC<Props> = ({
  areAllCompleted,
  onToggleAll,
}) => {
  return (
    <button
      type="button"
      className={classNames('todoapp__toggle-all', {
        active: areAllCompleted,
      })}
      data-cy="ToggleAllButton"
      onClick={onToggleAll}
    />
  );
};
