import { useEffect } from 'react';
import cn from 'classnames';

interface Props {
  setError: (errVal: string) => void;
  errorText: string;
}

export const Notification: React.FC<Props> = ({ errorText, setError }) => {
  useEffect(() => {
    setTimeout(() => {
      setError('');
    }, 3000);
  }, [setError]);

  return (
    <div className={
      cn('notification is-danger is-light has-text-weight-normal', {
        hidden: errorText === '',
      })
    }
    >
      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        type="button"
        className="delete"
        onClick={() => {
          setError('');
        }}
      />
      {errorText}
    </div>
  );
};
