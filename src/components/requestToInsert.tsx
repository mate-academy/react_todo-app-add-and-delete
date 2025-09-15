import { useEffect } from 'react';
import { client as fetchClient } from '../utils/fetchClient';
import { Todo } from '../types/Todo';

const USER_ID = 3381;

type Props = {
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setError: React.Dispatch<React.SetStateAction<boolean>>;
  setErrorType: React.Dispatch<React.SetStateAction<string>>;
};

export const useRequestToInsert = ({
  setTodos,
  setError,
  setErrorType,
}: Props) => {
  useEffect(() => {
    fetchClient
      .get<Todo[]>(`/todos?userId=${USER_ID}`)
      .then(data => {
        setTodos(data);
      })
      .catch(() => {
        setError(true);
        setErrorType('load');
      });
  }, []);
};
