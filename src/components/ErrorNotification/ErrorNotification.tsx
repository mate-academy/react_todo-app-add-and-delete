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
      {/* show only one message at a time
              Unable to load todos
              <br />
              Title should not be empty
              <br />
              Unable to add a todo
              <br />
              Unable to delete a todo
              <br /> */}
      {errorMessage}
    </div>
  );
};
