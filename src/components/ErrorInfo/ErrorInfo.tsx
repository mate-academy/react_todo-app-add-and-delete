/* eslint-disable jsx-a11y/control-has-associated-label */
import { FC } from 'react';
import cn from 'classnames';

interface Props {
  visibleError: string,
  setVisibleError: (value: React.SetStateAction<string>) => void,
}

export const ErrorInfo: FC<Props> = ({
  visibleError,
  setVisibleError,
}) => {
  const removeErrorOnClick = () => {
    setVisibleError('');
  };

  setTimeout(() => {
    if (visibleError) {
      removeErrorOnClick();
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
        onClick={removeErrorOnClick}
      />

      {/* {isUpdateError && ( //will be changed in future
        <>
          Unable to update a todo
          <br />
        </>
      )} */}

      {visibleError}

      <br />

    </div>
  );
};
