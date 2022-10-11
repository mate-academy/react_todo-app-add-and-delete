import { Error, ErrorMessages } from '../../types/Error';

type Props = {
  error: Error;
  handleError: (isError: boolean, value: ErrorMessages) => void;
};

export const Errors: React.FC<Props> = ({ error, handleError }) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={`notification is-danger is-light
      has-text-weight-normal ${!error.isError && 'hidden'}`}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => {
          handleError(false, ErrorMessages.ErrorRemove);
        }}
      >
        &apos;
      </button>
      {error.message}
      <br />
    </div>
  );
};
