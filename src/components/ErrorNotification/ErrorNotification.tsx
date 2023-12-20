import { FC } from 'react';

interface Props {
  hideErrorMessage: () => void,
  errorMessage: string | null,
}

export const ErrorNotification: FC<Props> = (props) => {
  const {
    hideErrorMessage,
    errorMessage,
  } = props;

  return (
    <div
      data-cy="ErrorNotification"
      className="notification is-danger is-light has-text-weight-normal"
    >
      {errorMessage}
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={hideErrorMessage}
        aria-label="Hide Error Message"
      />
    </div>
  );
};
