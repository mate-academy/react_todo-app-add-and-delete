import classNames from 'classnames';
import { useEffect, useRef } from 'react';

type Props = {
  error: string,
  onErrorChange: (error: string) => void,
};

export const ErrorNotification: React.FC<Props> = (props) => {
  const { error, onErrorChange } = props;
  const errorTimeOut = useRef<NodeJS.Timer>();

  useEffect(() => {
    if (error) {
      errorTimeOut.current = setTimeout(() => {
        onErrorChange('');
      }, 3000);
    } else {
      clearTimeout(errorTimeOut.current);
    }
  }, [error]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        {
          hidden: !error,
        },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        aria-label="Toggle All"
        onClick={() => onErrorChange('')}
      />

      {error}
    </div>
  );
};
