export const getError = (errorTitle: string) => {
  switch (errorTitle) {
    case 'emptyError':
      return 'Title should not be empty';
    case 'loadError':
      return 'Unable to load todos';
    case 'addError':
      return 'Unable to add a todo';
    case 'deleteError':
      return 'Unable to delete a todo';
    case 'updateError':
      return 'Unable to update a todo';
    default:
      return '';
  }
};
