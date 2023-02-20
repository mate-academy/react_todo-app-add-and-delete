import React from 'react';
import cn from 'classnames';

type Props = {
  isTodoUpdated: boolean;
};

export const ModalOverlay: React.FC<Props> = ({ isTodoUpdated }) => {
  return (
    <div className={cn('modal overlay', { 'is-active': isTodoUpdated })}>
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  );
};
