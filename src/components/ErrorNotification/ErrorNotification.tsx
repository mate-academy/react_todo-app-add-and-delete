/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import classNames from 'classnames';

interface Props {
  errorMessage: string;
  setErrorHide: () => void;
}

export const ErrorNotification: React.FC<Props> = (props) => {
  const { errorMessage, setErrorHide } = props;

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification', 'is-danger', 'is-light', 'has-text-weight-normal',
        {
          hidden: !errorMessage,
        },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={setErrorHide}
      />

      {errorMessage}
    </div>
  );
};
