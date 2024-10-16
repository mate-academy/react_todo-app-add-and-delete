import { Errors } from '../types/ErrorsEnum';

export const handleError = (
  error: Errors,
  setErrorNotification: React.Dispatch<React.SetStateAction<Errors>>,
) => {
  setErrorNotification(error);

  setTimeout(() => {
    setErrorNotification(Errors.DEFAULT);
  }, 3000);
};
