import React, { Dispatch, SetStateAction } from 'react';
import classNames from 'classnames';
import { Error } from '../../types/Todo';

type Props = {
  errorMessage: string;
  setErrorMessage: Dispatch<SetStateAction<Error>>;
};

export const ErrorNotification: React.FC<Props> = ({
  errorMessage,
  setErrorMessage,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      // eslint-disable-next-line max-len
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        {
          hidden: !errorMessage,
        },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorMessage(Error.DEFAULT)}
      />

      {errorMessage}
    </div>
  );
};
