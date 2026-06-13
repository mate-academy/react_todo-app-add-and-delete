import classNames from 'classnames';
import '../../styles/todoapp.scss';

interface Props {
  setErrorMessage: (message: string) => void;
  errorMessage: string;
}

export const ErrorNotification: React.FC<Props> = ({
  setErrorMessage,
  errorMessage,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
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
        onClick={() => setErrorMessage('')}
      />
      {errorMessage}
    </div>
  );
};
