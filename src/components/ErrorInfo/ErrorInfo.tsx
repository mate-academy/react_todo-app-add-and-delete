/* eslint-disable jsx-a11y/control-has-associated-label */
import { FC } from 'react';
import cn from 'classnames';

export interface IsValidData {
  isAddError: boolean,
  isDeleteError: boolean,
  isUpdateError: boolean,
  isLoadError: boolean,
  isTitleEmpty: boolean,
}

interface Props {
  isVisibleError: boolean,
  isValidData: IsValidData,
  setIsVisibleError: (value: React.SetStateAction<boolean>) => void,
}

export const ErrorInfo: FC<Props> = ({
  isVisibleError,
  isValidData,
  setIsVisibleError,
}) => {
  const {
    isAddError,
    isDeleteError,
    isUpdateError,
    isLoadError,
    isTitleEmpty,
  } = isValidData;

  const handleRemoveError = () => {
    setIsVisibleError(false);
  };

  setTimeout(() => {
    if (isVisibleError) {
      handleRemoveError();
    }
  }, 3000);

  return (
    <div className={cn(
      'notification',
      'is-danger',
      'is-light',
      'has-text-weight-normal',
      {
        hidden: !isVisibleError,
      },
    )}
    >
      <button
        type="button"
        className="delete"
        onClick={handleRemoveError}
      />

      {isAddError && (
        <>
          Unable to add a todo
          <br />
        </>
      )}

      {isDeleteError && (
        <>
          Unable to delete a todo
          <br />
        </>
      )}

      {isUpdateError && (
        <>
          Unable to update a todo
          <br />
        </>
      )}

      {isLoadError && (
        <>
          Unable to load a todos
          <br />
        </>
      )}

      {isTitleEmpty && (
        <>
          {'Title can\'t be empty'}
          <br />
        </>
      )}
    </div>
  );
};
