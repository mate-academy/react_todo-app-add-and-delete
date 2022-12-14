/* eslint-disable jsx-a11y/control-has-associated-label */

import { ErrorType } from '../../types/ErrorType';

type Props = {
  error: ErrorType;
  onErrorChange: (value: ErrorType) => void;
};

export const ErrorNotification: React.FC<Props> = ({
  onErrorChange,
  error,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className="notification is-danger is-light has-text-weight-normal"
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => {
          onErrorChange(ErrorType.None);
        }}
      />

      {error}
      <br />
    </div>
  );
};
