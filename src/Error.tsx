import cn from 'classnames';

type Props = {
  visibleErr: boolean;
  errMessage: string;
  setVisibleErr: (boolean: boolean) => void;
};

export const Error = ({ setVisibleErr, visibleErr, errMessage }: Props) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: !visibleErr,
      })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setVisibleErr(false)}
      />
      {errMessage}
    </div>
  );
};
