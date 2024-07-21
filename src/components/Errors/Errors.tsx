import * as React from 'react';
import { IsActiveError } from '../../types/types';
import classNames from 'classnames';
import { ErrorContext } from '../../utils/Store';

export const Errors: React.FC = () => {
  const { isError, setIsError } = React.useContext(ErrorContext);

  const errorMessage = React.useMemo(() => {
    return Object.values(IsActiveError).find(item => item === isError);
  }, [isError]);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsError(IsActiveError.NoError);
    }, 3000);

    return () => clearTimeout(timer);
  });

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        {
          hidden: isError === IsActiveError.NoError,
        },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setIsError(IsActiveError.NoError)}
      />
      {errorMessage}
    </div>
  );
};
