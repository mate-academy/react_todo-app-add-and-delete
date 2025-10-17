/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { useCallback, useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { ErrorCode } from './types/ErrorCode';
import { USER_ID } from './api/todos';
import { Content } from './components/Content';
import { ErrorNotifications } from './components/ErrorNotifications';

export const App: React.FC = () => {
  const [errorStatus, setErrorStatus] = useState<ErrorCode>(null);

  const showError = useCallback((errorCode: Exclude<ErrorCode, null>) => {
    setErrorStatus(errorCode);
  }, []);

  const clearError = useCallback(() => {
    setErrorStatus(null);
  }, []);

  useEffect(() => {
    if (!errorStatus) {
      return;
    }

    const timerId = setTimeout(() => {
      clearError();
    }, 3000);

    return () => {
      clearTimeout(timerId); // очищаємо помилку через 3с
    };
  }, [errorStatus, clearError]);

  const errorMessages: Record<Exclude<ErrorCode, null>, string> = {
    load_failed: 'Unable to load todos',
    title_empty: 'Title should not be empty',
    add_failed: 'Unable to add a todo',
    delete_failed: 'Unable to delete a todo',
    update_failed: 'Unable to update a todo',
  };

  const message: string = errorStatus ? errorMessages[errorStatus] : '';

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <Content onShowError={showError} onClearError={clearError} />

      <ErrorNotifications
        message={message}
        visible={errorStatus ? true : false} // !!errorStatus - коротший запис, перетворює в булеве значення
        onClose={() => setErrorStatus(null)}
      />
    </div>
  );
};
