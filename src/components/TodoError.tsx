import classNames from 'classnames';

type Props = {
  errorMessage: string,
  setErrorMessage: (value: string) => void,
};

// eslint-disable-next-line
export const TodoError: React.FC<Props> = ({ errorMessage, setErrorMessage }) => {
  return (
    <>
      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: !errorMessage },
      )}
      >
        {/* eslint-disable-next-line */}
        <button
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
        />
        {errorMessage}
      </div>
    </>
  );
};
