import { ErrorMessage, ErrorType } from '../types/Error';

function callError(
  setError: React.Dispatch<React.SetStateAction<ErrorType>>,
  errorType: ErrorMessage,
) {
  setError({
    isVisible: true,
    type: errorType,
  });
}

export default callError;
