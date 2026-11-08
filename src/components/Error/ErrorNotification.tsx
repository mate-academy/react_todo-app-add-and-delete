import '../../styles/index.scss';
import { ErrorType } from '../../types/ErrorType';

type Props = {
  errorType: ErrorType;
};

export const ErrorNotification = ({ errorType }: Props) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={`notification is-danger is-light has-text-weight-normal ${errorType === null ? 'hidden' : ''}`}
    >
      <button data-cy="HideErrorButton" type="button" className="delete" />
      {/* show only one message at a time */}
      {errorType === 'load' && (
        <>
          Unable to load todos
          <br />
        </>
      )}
      {errorType === 'title' && (
        <>
          Title should not be empty
          <br />
        </>
      )}
      {errorType === 'add' && (
        <>
          Unable to add a todo
          <br />
        </>
      )}
      {errorType === 'delete' && (
        <>
          Unable to delete a todo
          <br />
        </>
      )}
      {false && (
        <>
          Unable to update a todo
          <br />
        </>
      )}
    </div>
  );
};
