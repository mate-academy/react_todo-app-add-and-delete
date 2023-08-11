import cn from 'classnames';

type Props = {
  isError: boolean,
  onSetError: (value: boolean) => void;
  errorMessage: string,
};

export const TodoError: React.FC<Props> = ({
  isError,
  onSetError,
  errorMessage,
}) => {
  return (
    <div
      className={cn(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: !isError },
      )}
    >
      <button
        type="button"
        className="delete"
        onClick={() => onSetError(false)}
      >
        ×
      </button>

      {errorMessage}
    </div>
  );
};
