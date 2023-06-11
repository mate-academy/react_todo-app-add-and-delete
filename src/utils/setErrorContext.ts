import { Dispatch, SetStateAction, createContext } from 'react';
import { ErrorMessage } from './ErrorMessage';

export const SetErrorContext
  = createContext<Dispatch<SetStateAction<ErrorMessage>> | null>(
    null as unknown as Dispatch<SetStateAction<ErrorMessage>>,
  );
