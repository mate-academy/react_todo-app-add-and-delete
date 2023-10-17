import { getTodos } from '../api/todos';
import { ErrorMessageEnum } from '../types/ErrorMessageEnum';
import { Todo } from '../types/Todo';
import { USER_ID } from './UserID';

export const getData = async (
  setFunctions: React.Dispatch<React.SetStateAction<Todo[]>>[],
  setErrorMessage: React.Dispatch<React.SetStateAction<'' | ErrorMessageEnum>>,
) => {
  try {
    const data = await getTodos(USER_ID);

    setFunctions.forEach(setFunction => setFunction(data));
  } catch {
    setErrorMessage(ErrorMessageEnum.TodoLoadError);
  }
};
