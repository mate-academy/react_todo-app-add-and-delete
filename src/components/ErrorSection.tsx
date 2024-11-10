import classNames from 'classnames';
import { ErrorMessage } from '../types/ErrorMessage';

type Props = {
  errorMessage: ErrorMessage;
};

export const ErrorSection: React.FC<Props> = ({ errorMessage }) => (
  <div
    data-cy="ErrorNotification"
    className={classNames(
      'notification',
      'is-danger',
      'is-light',
      'has-text-weight-normal',
      {
        hidden:
          !errorMessage.load &&
          !errorMessage.delete &&
          !errorMessage.create &&
          !errorMessage.emptyTitle,
      },
    )}
  >
    <button data-cy="HideErrorButton" type="button" className="delete" />
    {/* show only one message at a time */}
    {errorMessage.load && 'Unable to load todos'}
    {errorMessage.create && 'Unable to add a todo'}
    {errorMessage.delete && 'Unable to delete a todo'}
    {errorMessage.emptyTitle && 'Title should not be empty'}
    {false && (
      <>
        <br />
        Unable to update a todo
      </>
    )}
  </div>
);
