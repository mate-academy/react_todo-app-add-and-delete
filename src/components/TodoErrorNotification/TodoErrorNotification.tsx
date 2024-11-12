import { FC, useContext, useEffect } from 'react';
import { ErrorNotification } from '../ErrorNotification/ErrorNotification';
import { TodoContext } from '../../context/todo/TodoContext';

interface TodoErrorNotificationProps {}

export const TodoErrorNotification: FC<TodoErrorNotificationProps> = ({}) => {
  const { errorMessage, setErrorMessage } = useContext(TodoContext);

  useEffect(() => {
    const timer = setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <ErrorNotification
      errorMessage={errorMessage}
      setErrorMessage={setErrorMessage}
    />
  );
};
