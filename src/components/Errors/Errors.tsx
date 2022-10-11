/* eslint-disable jsx-a11y/control-has-associated-label */
import { Error } from '../../types/Error';

type Props = {
  error: Error;
  handleError: (isError: boolean, value: string) => void;
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
          handleError(false, '');
        }}
      />
      {error.message}
      <br />

      {/* Unable to add a todo
      <br />
      Unable to delete a todo
      <br />
      Unable to update a todo */}
    </div>
  );
};
