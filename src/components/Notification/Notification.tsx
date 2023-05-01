import React from 'react';
import classNames from 'classnames';
import { ErrorType } from '../../types/ErrorType';

type Props = {
  hasError: ErrorType,
  setHasError: React.Dispatch<React.SetStateAction<ErrorType>>,
};

export const Notification: React.FC<Props> = React.memo(
  ({ hasError, setHasError }) => {
    setTimeout(() => {
      setHasError(ErrorType.NONE);
    }, 3000);

    const handlerOnClick = () => setHasError(ErrorType.NONE);

    return (
      <div
        className={classNames(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          {
            hidden: !(hasError !== ErrorType.NONE),
          },
        )}
      >
        <button
          type="button"
          aria-label="delete"
          className="delete"
          onClick={handlerOnClick}
        />
        {hasError}
      </div>
    );
  },
);
