import classNames from 'classnames';
import PropTypes from 'prop-types';
import type { FC } from 'react';

type Props = {
  message: string;
  onClose: () => void;
};

export const ErrorNotification: FC<Props> = ({ message, onClose }) => (
  <div
    data-cy="ErrorNotification"
    className={classNames(
      'notification is-danger is-light has-text-weight-normal',
      {
        hidden: !message,
      },
    )}
  >
    <button
      data-cy="HideErrorButton"
      type="button"
      className="delete"
      aria-label="Hide error notification"
      onClick={onClose}
    />

    {message}
  </div>
);

ErrorNotification.propTypes = {
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};
