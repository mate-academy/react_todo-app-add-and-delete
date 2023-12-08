/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';

export type ErrorMessageProps = {
  errorText: string
  setErrorText: (error: string) => void
};

export const ErrorMessage = ({
  errorText, setErrorText,
} : ErrorMessageProps) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: errorText === '' },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorText('')}
      />
      {errorText}
    </div>
  );
};
