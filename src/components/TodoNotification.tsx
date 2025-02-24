import cn from 'classnames';

type Props = {
  errorText: string;
};

export const TodoNotification: React.FC<Props> = ({ errorText }) => {
  return (
    //DON'T use conditional rendering to hide the notification
    //Add the 'hidden' class to hide the message smoothly
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: !errorText,
      })}
    >
      <button data-cy="HideErrorButton" type="button" className="delete" />
      {errorText}
      {/* show only one message at a time */}
      {/* Unable to load todos
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
