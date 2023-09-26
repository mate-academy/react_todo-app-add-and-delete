/* eslint-disable jsx-a11y/control-has-associated-label */
import cn from 'classnames';

type ErrorBinProps = {
  setErrorMessage: (str: string) => void;
  errorMessage: string;
};

export const ErrorBin: React.FC<ErrorBinProps> = ({
  setErrorMessage,
  errorMessage,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={cn(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: errorMessage === '' },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => {
          setErrorMessage('');
        }}
        disabled={errorMessage === ''}
      />
      {/* show only one message at a time */}
      {errorMessage && `${errorMessage}`}

      {/* {errorMessage && `${errorMessage}`} */}
    </div>
  );
};
