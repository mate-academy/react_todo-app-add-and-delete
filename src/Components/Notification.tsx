import classNames from 'classnames';

type Props = {
  setErrorMessage: (string: string) => void,
  errorMessage: string,
};

export const Notification: React.FC<Props> = ({
  setErrorMessage,
  errorMessage,
}) => {
  return (
    <div className={classNames(
      'notification is-danger is-light has-text-weight-normal',
      { hidden: !errorMessage },
    )}
    >
      {/* eslint-disable-next-line */}
      <button
        type="button"
        className="delete"
        onClick={() => setErrorMessage('')}
      />
      <span>{errorMessage}</span>
    </div>
  );
};
