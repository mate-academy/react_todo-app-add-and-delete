/* eslint-disable jsx-a11y/control-has-associated-label */

import classNames from 'classnames';

type Props = {
  errorMessage: string;
  setErrorMessage: (newMessage: string) => void;
};

export const Error: React.FC<Props> = ({
  errorMessage,
  setErrorMessage = () => {},
}) => {
  return (
    // Notification is shown in case of any error
    // Add the 'hidden' class to hide the message smoothly
    <div
      className={classNames(
        'notification is-danger is-light has-text-weight-normal', {
          hidden: !errorMessage,
        },
      )}
    >
      <button
        type="button"
        className="delete"
        onClick={() => setErrorMessage('')}
      />

      {errorMessage}
    </div>
  );
};
