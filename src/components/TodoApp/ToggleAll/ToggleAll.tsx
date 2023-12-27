/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import { useCallback, useContext } from 'react';
import { DispatchContext } from '../../../libs/state';
import { Actions } from '../../../libs/enums';

type Props = {
  hasActiveTodos: boolean;
};

export const ToggleAll: React.FC<Props> = ({ hasActiveTodos }) => {
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
      data-cy="ToggleAllButton"
      onClick={handleToggleAll}
    />
  );
};
