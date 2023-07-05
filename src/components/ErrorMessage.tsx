import classNames from 'classnames';

interface Props {
  errorMessage: string;
  setErrorMessage: (errorMessage: string) => void;
}

export const ErrorMessage: React.FC<Props> = (
  { errorMessage, setErrorMessage },
) => {
  return (
    <div className={classNames(
      'notification is-danger is-light has-text-weight-normal',
      { hidden: !errorMessage },
    )}
    >
      { /* eslint-disable-next-line jsx-a11y/control-has-associated-label */ }
      <button
        type="button"
        className="delete"
        onClick={() => setErrorMessage('')}
      />
      {errorMessage}
    </div>
  );
};
