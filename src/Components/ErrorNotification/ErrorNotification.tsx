import cn from 'classnames';

type Props = {
  messageError: string;
  setMessageError: (_: string) => void;
};

export const ErrorNotification: React.FC<Props> = ({
  messageError,
  setMessageError,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={cn(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: !messageError },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setMessageError('')}
      />
      {messageError}
    </div>
  );
};
