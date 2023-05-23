import classNames from 'classnames';

type Props = {
  handleCloseButton: () => void,
  errorMessage: string,
  hasError: boolean,
};

export const TodoNotification: React.FC<Props> = ({
  handleCloseButton,
  errorMessage,
  hasError,
}) => {
  return (
    <div className={classNames(
      'notification',
      'is-danger',
      'is-light',
      'has-text-weight-normal',
      { hidden: !hasError },
    )}
    >
      <button
        type="button"
        className="delete"
        onClick={() => handleCloseButton()}
      />

      <span>{errorMessage}</span>
    </div>
  );
};
