import React from 'react';
import cn from 'classnames';

type Props = {
  visibleError: string;
  setVisibleError: (value: string) => void;
};

export const Message: React.FC<Props> = ({ visibleError, setVisibleError }) => {
  const removeErrorMessage = () => {
    setVisibleError('');
  };

  setTimeout(() => {
    if (visibleError) {
      removeErrorMessage();
    }
  }, 3000);

  return (
    <div className={cn(
      'notification',
      'is-danger',
      'is-light',
      'has-text-weight-normal',
      {
        hidden: !visibleError,
      },
    )}
    >
      <button
        type="button"
        className="delete"
        aria-label="Delete"
        onClick={removeErrorMessage}
      />

      {visibleError}
    </div>
  );
};
