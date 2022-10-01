/* eslint-disable jsx-a11y/control-has-associated-label */
import cN from 'classnames';
import { Error } from '../../../types/Errors';

type Props = {
  onErrorChange: (isError: Error | null) => void,
  errors: Error,
};

export const ErrorNotification: React.FC<Props> = ({
  errors,
  onErrorChange,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={cN(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !errors },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => {
          onErrorChange(null);
        }}
      />
      {errors}
    </div>
  );
};
