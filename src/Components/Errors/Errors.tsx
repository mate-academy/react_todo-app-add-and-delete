import classNames from 'classnames';
import { memo, useEffect } from 'react';

interface Props {
  error: string;
  setIsError: (str: string) => void;
}

export const Errors: React.FC<Props> = memo(({
  error,
  setIsError,
}) => {
  useEffect(() => {
    setTimeout(() => setIsError(''), 3000);
  }, []);

  return (
    <div
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !error },
      )}
    >
      <button
        type="button"
        className="delete"
        aria-label="button delete"
        onClick={() => setIsError('')}
      />
      {error}
    </div>
  );
});
