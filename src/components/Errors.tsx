import { FC } from 'react';
import cn from 'classnames';
import { useAppContext } from '../context/AppContext';

export const Errors: FC = () => {
  const { showError, setShowError, errorMessage } = useAppContext();

  return (
    <div
      data-cy="ErrorNotification"
      className={cn(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal', {
          hidden: !showError,
        },
      )}
    >
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setShowError(false)}
      />
      {errorMessage}
    </div>
  );
};
