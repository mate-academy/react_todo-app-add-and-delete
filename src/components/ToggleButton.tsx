import cn from 'classnames';
import React from 'react';

type ToggleButtonProps = {
  isActive: boolean,
};

export const ToggleButton: React.FC<ToggleButtonProps> = ({
  isActive,
}) => {
  return (
    // eslint-disable-next-line jsx-a11y/control-has-associated-label
    <button
      type="button"
      className={cn(
        'todoapp__toggle-all',
        {
          active: isActive,
        },
      )}
    />
  );
};
