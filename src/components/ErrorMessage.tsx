/* eslint-disable react/display-name */

import classNames from 'classnames';
import React from 'react';

type Props = {
  errorMessage: string;
  deleteErrorMessage: () => void;
};

const ErrorMessage: React.FC<Props> = React.memo(
  ({ errorMessage, deleteErrorMessage }) => {
    return (
      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          {
            hidden: !errorMessage,
          },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={deleteErrorMessage}
        />
        {errorMessage}
      </div>
    );
  },
);

export default ErrorMessage;
