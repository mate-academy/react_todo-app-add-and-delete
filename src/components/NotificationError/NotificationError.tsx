import classNames from 'classnames';
import { Dispatch, FC, SetStateAction } from 'react';

type Props = {
  error: string,
  setError: Dispatch<SetStateAction<string>>,
};

export const NotificationError: FC<Props> = ({
  error,
  setError,
}) => {
  return (
    <div className={classNames(
      'notification',
      'is-danger',
      'is-light',
      'has-text-weight-normal',
      {
        hidden: !error.length,
      },
    )}
    >
      <button
        type="button"
        className="delete"
        onClick={() => setError('')}
        aria-label="close"
      />
      {error}
    </div>
  );
};
