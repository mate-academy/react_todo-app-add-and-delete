/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import cn from 'classnames';

type Props = {
  activeTodos: number,
};

export const ToggleAll: React.FC<Props> = ({
  activeTodos,
}) => {
  return (
    <button
      type="button"
      className={cn('todoapp__toggle-all', { active: activeTodos })}
    />
  );
};
