import { useContext } from 'react';
import { Errors } from '../types/Errors';
import { TodosContext } from '../context/TodosContext';

const ErrorMessageComponent = () => {
  const { errorMessage } = useContext(TodosContext);

  switch (errorMessage) {
    case Errors.NoErrors:
      return Errors.NoErrors;

    case Errors.LoadingError:
      return Errors.LoadingError;

    case Errors.TitleEmplyError:
      return Errors.TitleEmplyError;

    case Errors.AddTodoError:
      return Errors.AddTodoError;

    case Errors.DeleteTodoError:
      return Errors.DeleteTodoError;

    case Errors.UpdateTodoError:
      return Errors.UpdateTodoError;

    default:
      return '';
  }
};

export default ErrorMessageComponent;
