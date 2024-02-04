import classNames from 'classnames';
import React, { useCallback, useContext } from 'react';
import { DispatchContext } from '../../../libs/state';
import { Actions } from '../../../libs/enums';

type Props = {
  hasActiveTodos:boolean;
};

export const ToggleAll:React.FC<Props> = ({ hasActiveTodos }) => {
  const dispatch = useContext(DispatchContext);

  const handleToggleAll = useCallback(() => {
    dispatch({
      type: Actions.toggleAll,
      payload: { isCompleted: hasActiveTodos },
    });
  },
  [dispatch, hasActiveTodos]);

  return (
    <button
      type="button"
      className={classNames('todoapp__toggle-all', {
        active: !hasActiveTodos,
      })}
      aria-label="Toggle all"
      data-cy="ToggleAllButton"
      onClick={handleToggleAll}
    />
  );
};
