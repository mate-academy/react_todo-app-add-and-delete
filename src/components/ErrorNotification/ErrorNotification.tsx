import React, { useEffect } from 'react';

interface Props {
  errorMessage: string;
  setErrorMessage: (message: string) => void;
  hideErrorNotice: () => void;
  errorNoticeRef: React.RefObject<HTMLDivElement>;
}

export const ErrorNotification: React.FC<Props> = ({
  errorMessage,
  setErrorMessage,
  hideErrorNotice,
  errorNoticeRef,
}) => {
  const errorNoticeDiv = errorNoticeRef.current as HTMLDivElement;

  const showErrorNotice = () => {
    errorNoticeDiv.classList.remove('hidden');
  };

  useEffect(() => {
    if (errorMessage) {
      showErrorNotice();
      setTimeout(() => {
        hideErrorNotice();
        setErrorMessage('');
      }, 3000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errorMessage]);

  return (
    <div
      data-cy="ErrorNotification"
      // eslint-disable-next-line max-len
      className="notification is-danger is-light has-text-weight-normal hidden"
      ref={errorNoticeRef}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={hideErrorNotice}
      />
      {/* Below comments will be removed once 'Error Notification' logic is fully implemented */}
      {/* show only one message at a time */}
      {errorMessage}
      {/* Unable to load todos __DONE */}
      <br />
      {/* Title should not be empty __DONE */}
      <br />
      {/* Unable to add a todo __DONE */}
      <br />
      {/* Unable to delete a todo __DONE*/}
      <br />
      {/* Unable to update a todo */}
    </div>
  );
};
