import cn from 'classnames';
import { Errors } from '../../types/Errors';

interface Props {
  isError: () => boolean;
  errors: Errors;
}

export const ErrorNotification: React.FC<Props> = ({ isError, errors }) => (
  <div
    data-cy="ErrorNotification"
    className={cn(
      'notification',
      'is-danger',
      'is-light',
      'has-text-weight-normal',
      { hidden: !isError() },
    )}
  >
    <button data-cy="HideErrorButton" type="button" className="delete" />
    {errors.loadingError && 'Unable to load todos'}
    {errors.emptyTitleError && 'Title should not be empty'}
    {errors.addingError && 'Unable to add a todo'}
    {errors.deletingError && 'Unable to delete a todo'}
  </div>
);
