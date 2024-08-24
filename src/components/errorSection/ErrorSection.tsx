import { FC } from 'react';
import classNames from 'classnames';
import { useClearErrorMessage } from '../../hooks/useClearErrorMessage';
import { useTodosContext } from '../../context/context';

export const ErrorSection: FC = () => {
  const { errorMessage, setErrorMessage } = useTodosContext();

  useClearErrorMessage(errorMessage, setErrorMessage);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: !errorMessage },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorMessage('')}
      />
      {errorMessage}
    </div>
  );
};
