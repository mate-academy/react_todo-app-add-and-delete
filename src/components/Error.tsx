import cn from 'classnames';

type Props = {
  message: string;
  visible: boolean;
  onHide: () => void;
};

export const Error = ({ message, visible, onHide }: Props) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: !visible,
      })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={onHide}
      />
      {message}
    </div>
  );
};
