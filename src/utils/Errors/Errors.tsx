import { useEffect } from 'react';

type Props = {
  handleErrorClose: () => void;
  error: string;
};

export const Errors: React.FC<Props> = ({ handleErrorClose, error }) => {
  useEffect(() => {
    setTimeout(() => {
      handleErrorClose();
    }, 3000);
  }, [handleErrorClose]);

  return (
    <div
      data-cy="ErrorNotification"
      className={`notification is-danger is-light has-text-weight-normal ${error ? '' : 'hidden'}`}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={handleErrorClose}
      />
      {/* show only one message at a time */}
      {error && <p>{error}</p>}
    </div>
  );
};
