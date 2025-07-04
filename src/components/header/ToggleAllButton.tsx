import classNames from 'classnames';
import React from 'react';

type Props = {
  allCompleted: boolean;
};

export const Button: React.FC<Props> = ({ allCompleted }) => {
  {
    /* this button should have `active` class only if all todos are completed */
  }

  return (
    <button
      type="button"
      className={classNames('todoapp__toggle-all', { active: allCompleted })}
      data-cy="ToggleAllButton"
    />
  );
};
