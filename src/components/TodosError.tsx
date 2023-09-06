import { useContext } from 'react';
import { ErrorType } from '../types/ErrorType';
// eslint-disable-next-line import/no-cycle
import { TodosContext } from './TodosContext';

export const TodoError: React.FC = () => {
  const { closeNotification, notification }
  = useContext(TodosContext);

  return (
    <>
      {notification && (
        <div
          className={`notification ${
            ErrorType.Title ? 'is-danger' : 'is-light'
          } is-danger is-light has-text-weight-normal`}
        >
          {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
          <button
            type="button"
            className="delete"
            onClick={closeNotification}
          />
          {ErrorType.Title}
        </div>
      )}
    </>
  );
};
