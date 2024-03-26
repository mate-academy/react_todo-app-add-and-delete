import cn from 'classnames';

type Props = {
  message: string;
  onClose: (a: string) => void;
};
export const ErrorNotifications: React.FC<Props> = ({ message, onClose }) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={cn(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        {
          hidden: !message,
        },
      )}
    >
      <button
        id="hideErrorButton"
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => onClose('')}
        aria-label="Close Error"
      />
      {message}
      {/* 
    Unable to load todos
    <br />
    Title should not be empty
    <br />
    Unable to add a todo
    <br />
    Unable to delete a todo
    <br />
    Unable to update a todo */}
    </div>
  );
};
