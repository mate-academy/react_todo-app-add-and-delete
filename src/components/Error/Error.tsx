import { useCallback } from 'react';
import { ErrorsEnum } from '../../utils/ErrorsEnum';

export interface ErrorProps {
  error: ErrorsEnum | null;
  clearError: (value: null) => void;
}

export const Error: React.FC<ErrorProps> = ({ error, clearError }) => {
  const handleCloseError = useCallback(() => {
    clearError(null);
  }, [clearError]);

  return (
    <div
      data-cy="ErrorNotification"
      className={`notification is-danger is-light has-text-weight-normal ${error ? '' : 'hidden'}`}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={handleCloseError}
      />
      {error}
    </div>
  );
};
