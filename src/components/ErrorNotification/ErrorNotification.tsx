/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';

type Props = {
  isError: boolean;
  setIsError: (value: boolean) => void,
  errorType: string,
};

export const ErrorNotification: React.FC<Props> = ({
  isError,
  setIsError,
  errorType,
}) => {
  const closeErrorNotification = () => {
    setIsError(false);
  };

  return (
    <div
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !isError },
      )}
    >
      <button
        type="button"
        className="delete"
        onClick={closeErrorNotification}
      />

      {errorType}
    </div>
  );
};
