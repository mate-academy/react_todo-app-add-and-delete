import cn from 'classnames';

type Props = {
  errorVisible: boolean;
  errorMessage: string;
  showError: (value: boolean) => void;
};

export const ErrorMessage: React.FC<Props> = ({
  errorVisible,
  errorMessage,
  showError,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={cn(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        {
          hidden: !errorVisible,
        },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => {
          showError(false);
        }}
      />
      {errorMessage}
    </div>
  );
};
