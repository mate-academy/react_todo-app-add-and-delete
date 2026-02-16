import classNames from 'classnames';

interface Props {
  errorMessage: string;
  setErrorMessage: (value: string) => void;
}

export const Errors: React.FC<Props> = ({ errorMessage, setErrorMessage }) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !errorMessage },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorMessage('')}
      />
      {errorMessage}
    </div>
  );
};
