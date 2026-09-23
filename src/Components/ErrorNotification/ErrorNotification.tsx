import cn from 'classnames';

type Props = {
  errorMessage: string;
  handleErrorRemoval: () => void;
};

export const ErrorNotification: React.FC<Props> = ({
  errorMessage,
  handleErrorRemoval,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: errorMessage === '',
      })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={handleErrorRemoval}
      />
      {errorMessage}
    </div>
  );
};
