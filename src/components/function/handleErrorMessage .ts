import { isErrorWithMessage } from './isErrorWithMessage';

export const handleErrorMessage = (
  error: Error,
  setErrorNotification: React.Dispatch<React.SetStateAction<string | null>>,
) => {
  if (isErrorWithMessage(error)) {
    const errorMessage = error.message;

    switch (errorMessage) {
      case 'Title should not be empty':
        setErrorNotification('Title should not be empty');
        break;
      case 'Unable to add a todo':
        setErrorNotification('Unable to add a todo');
        break;
      case 'Unable to delete a todo':
        setErrorNotification('Unable to delete a todo');
        break;
      case 'Unable to update a todo':
        setErrorNotification('Unable to update a todo');
        break;
      default:
        setErrorNotification('Unable to load todos');
    }
  } else {
    setErrorNotification('An unknown error occurred');
  }
};
