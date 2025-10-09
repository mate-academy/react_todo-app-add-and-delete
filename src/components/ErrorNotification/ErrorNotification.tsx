import React from 'react';
import cn from 'classnames';

type Props = {
  isVisible: boolean;
  msg: string;
  onErrMsgHide: () => void;
};

const ErrorNotification: React.FC<Props> = ({
  isVisible,
  msg,
  onErrMsgHide,
}: Props) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: !isVisible,
      })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={onErrMsgHide}
      />
      {msg}
    </div>
  );
};

export default React.memo(ErrorNotification);
