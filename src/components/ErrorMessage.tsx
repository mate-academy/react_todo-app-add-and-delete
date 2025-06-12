import cn from 'classnames';
import { useEffect } from 'react';

type Props = {
  errorMessage: string;
  onErrorChange: (arg: string) => void;
};

export const ErrorMessage: React.FC<Props> = ({
  errorMessage,
  onErrorChange,
}) => {
  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timer = setTimeout(() => {
      onErrorChange('');
    }, 3000);

    return () => clearTimeout(timer);
  }, [errorMessage, onErrorChange]);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: !errorMessage,
      })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => onErrorChange('')}
      />
      {errorMessage}
    </div>
  );
};
