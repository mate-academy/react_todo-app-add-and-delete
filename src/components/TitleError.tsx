/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';

type Props = {
  titleError: boolean,
  onSetTitleError: (isError: boolean) => void,
};

export const TitleError: React.FC<Props> = (
  {
    titleError,
    onSetTitleError,
  },
) => {
  return (
    <>
      <br />
      <div
        className={classNames(
          'notification', 'is-danger', 'is-light',
          'has-text-weight-normal', {
            hidden: !titleError,
          },
        )}
      >
        <span>Title can&apos;t be empty</span>
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => onSetTitleError(false)}
        />
      </div>
    </>
  );
};
