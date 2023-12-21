/* eslint-disable jsx-a11y/control-has-associated-label */

import classNames from 'classnames';
import React from 'react';

type Props = {
  areAllActiveTodos: boolean;
};

export const ToogleButton: React.FC<Props> = ({ areAllActiveTodos }) => (
  <button
    type="button"
    className={classNames(
      'todoapp__toggle-all',
      { active: areAllActiveTodos },
    )}
    data-cy="ToggleAllButton"
  />
);
