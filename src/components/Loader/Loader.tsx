import cn from 'classnames';
import React, { memo } from 'react';

type Props = {
  isLoading: boolean,
  isDeleting: boolean,
};

export const Loader: React.FC<Props> = memo(({ isLoading, isDeleting }) => {
  return (
    <div
      data-cy="TodoLoader"
      className={cn(
        'modal',
        'overlay',
        { 'is-active': isLoading || isDeleting },
      )}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  );
});
