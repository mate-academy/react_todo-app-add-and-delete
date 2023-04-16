import classNames from 'classnames';

type Props = {
  isError: boolean,
  setIsError: (boolean: boolean) => void,
  errorMessage: string,
};

export const Notification: React.FC<Props> = ({
  isError,
  setIsError,
  errorMessage,
}) => {
  return (
    <div className={classNames(
      'notification is-danger is-light has-text-weight-normal',
      { hidden: !isError },
    )}
    >
      {/* eslint-disable-next-line */}
      <button
        type="button"
        className="delete"
        onClick={() => setIsError(false)}
      />
      <span>{errorMessage}</span>
    </div>
  );
};
