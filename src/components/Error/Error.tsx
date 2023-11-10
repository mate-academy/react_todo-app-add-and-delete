/* eslint-disable jsx-a11y/control-has-associated-label */

import classNames from 'classnames';

type Props = {
  errorMessage: string;
  setErrorMessage: (newMessage: string) => void;
};

export const Error: React.FC<Props> = ({
  errorMessage,
  setErrorMessage = () => { },
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal', {
          hidden: !errorMessage,
        },
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
