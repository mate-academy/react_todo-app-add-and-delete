import { useEffect } from 'react';

interface Props {
  setError: (errVal: string | boolean) => void;
  errorText: string | true;
}

export const Notification: React.FC<Props> = ({ errorText, setError }) => {
  useEffect(() => {
    setTimeout(() => {
      setError(false);
    }, 3000);
  }, []);

  return (
    <div className="notification is-danger is-light has-text-weight-normal">
      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        type="button"
        className="delete"
        onClick={() => {
          setError(false);
        }}
      />
      {errorText === 'empty'
        ? ('Title can\'t be empty')
        : `Unable to ${errorText} a todo`}
    </div>
  );
};
