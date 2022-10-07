import { Error } from '../../types/Error';

export type Props = {
  error: Error;
  setError: (error: Error) => void;
};
