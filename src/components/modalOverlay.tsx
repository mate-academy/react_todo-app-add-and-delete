import React from 'react';
import classNames from 'classnames';

type Props = {
  isTodoUpdating: boolean,
  isTodoDeleting: boolean,
};

export const ModalOverlay: React.FC<Props> = ({
  isTodoUpdating,
  isTodoDeleting,
}) => {
  return (
    <div className={classNames(
      'modal', 'overlay', {
        'is-active':
     isTodoUpdating || isTodoDeleting,
      },
    )}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  );
};
