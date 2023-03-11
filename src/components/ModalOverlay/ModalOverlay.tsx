import React from 'react';
import classNames from 'classnames';

type Props = {
  isTodoUpdated: boolean;
};

export const ModalOverlay: React.FC<Props> = React.memo(({ isTodoUpdated }) => {
  return (
    <div className={classNames('modal overlay',
      { 'is-active': isTodoUpdated })}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  );
});
