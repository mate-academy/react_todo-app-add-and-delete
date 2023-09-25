import classNames from 'classnames';

/* eslint-disable jsx-a11y/control-has-associated-label */
type ErrorAreaProps = {
  onClick: () => void
  errorMessage: string
};

export const ErrorArea = ({ onClick, errorMessage }: ErrorAreaProps) => {
  const errorDivClasses = classNames(
    'notification',
    'is-danger',
    'is-light',
    'has-text-weight-normal',
    { hidden: errorMessage === '' },
  );

  return (
    <div
      data-cy="ErrorNotification"
      className={errorDivClasses}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={onClick}
      />
      {errorMessage}
    </div>
  );
};
