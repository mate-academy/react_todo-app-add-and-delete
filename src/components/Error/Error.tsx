import classNames from 'classnames';

type Props = {
  setErrorMesage: (message: string) => void;
  errorMesage: string;
};

export const Error: React.FC<Props> = ({ setErrorMesage, errorMesage }) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !errorMesage },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorMesage('')}
      />
      {/* show only one message at a time */}
      {errorMesage}
    </div>
  );
};
