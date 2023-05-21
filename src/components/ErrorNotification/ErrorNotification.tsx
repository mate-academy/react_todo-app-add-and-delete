/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import { FC, useEffect } from 'react';
import { ErrorType } from '../../types/Error';

interface Props {
  error: ErrorType;
  onChangeError: React.Dispatch<React.SetStateAction<ErrorType>>;
}

export const ErrorNotification: FC<Props> = ({ error, onChangeError }) => {
  useEffect(() => {
    const timerId = setTimeout(() => onChangeError(ErrorType.None), 3000);

    return () => {
      clearTimeout(timerId);
    };
  }, [error]);

  const handleErrorNotification = () => {
    onChangeError(ErrorType.None);
  };

  return (
    <div className={classNames(
      'notification is-danger is-light has-text-weight-normal', {
        hidden: error === ErrorType.None,
      },
    )}
    >
      <button
        type="button"
        className="delete"
        onClick={handleErrorNotification}
      />
      {error}
    </div>
  );
};
