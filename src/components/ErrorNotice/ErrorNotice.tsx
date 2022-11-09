/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import React, { useEffect } from 'react';
import { ErrorNoticeType } from '../../types/ErrorNoticeType';

interface Props {
  hasError: boolean,
  errorNotice: ErrorNoticeType,
  setHasError: (status: boolean) => void,
}

export const ErrorNotice: React.FC<Props> = ({
  hasError,
  errorNotice,
  setHasError,
}) => {
  useEffect(() => {
    setTimeout(() => setHasError(false), 3000);
  }, [hasError]);

  const closeErrorNotice = () => setHasError(false);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal', {
          hidden: !hasError,
        },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={closeErrorNotice}
      />

      {errorNotice}
    </div>
  );
};
