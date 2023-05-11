import classNames from 'classnames';
import { Errors } from '../types/Errors';

type Props = {
  setTypeError: (typeError: Errors | null) => void
  typeError: string | null
};

export const Notification: React.FC<Props> = ({
  setTypeError,
  typeError,
}) => {
  const { ADD, REMOVE, EMPTY } = Errors;

  if (typeError) {
    setTimeout(() => {
      setTypeError(null);
    }, 3000);
  }

  const returnTextError = (value: string | null) => {
    switch (value) {
      case ADD:
        return 'Unable to add a todo';
      case REMOVE:
        return 'Unable to delete a todo';
      case EMPTY:
        return "Title can't be empty";
      default:
        return 'Unable to update a todo';
    }
  };

  return (
    <div className={classNames(
      'notification',
      'is-danger',
      'is-light',
      'has-text-weight-normal',
      { hidden: !typeError },
    )}
    >
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        type="button"
        className="delete"
        onClick={() => {
          setTypeError(null);
        }}
      />
      {returnTextError(typeError)}
    </div>
  );
};
