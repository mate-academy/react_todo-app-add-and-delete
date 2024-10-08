import cn from 'classnames';

type Props = {
  errorMessage: string;
};

export const Error: React.FC<Props> = ({ errorMessage }) => {
  return (
    // {/* DON'T use conditional rendering to hide the notification */}
    // {/* Add the 'hidden' class to hide the message smoothly */}
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: !errorMessage,
      })}
    >
      <button data-cy="HideErrorButton" type="button" className="delete" />
      {errorMessage}
    </div>
  );
};
