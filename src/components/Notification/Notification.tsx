import { useEffect } from 'react';

type Props = {
  error: string;
  setError: (error:string) => void;
};

export const Notification:React.FC<Props> = ({ error, setError }) => {
  const closeNotification = () => {
    setError('');
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      closeNotification();
    }, 3000);

    return () => {
      clearTimeout(timeout);
    };
  }, [error]);

  return (
    <div
      className="notification is-danger is-light has-text-weight-normal"
      hidden={!error}
    >
      {/*  eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        type="button"
        className="delete"
        onClick={closeNotification}
      />

      {error}
      {/* Unable to add a todo
      <br />
      Unable to delete a todo
      <br />
      Unable to update a todo */}
    </div>
  );
};
