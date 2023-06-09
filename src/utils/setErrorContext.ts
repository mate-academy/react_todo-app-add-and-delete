import { Dispatch, SetStateAction, createContext } from 'react';

export const SetErrorContext
  = createContext<Dispatch<SetStateAction<string | null>> | null>(
    null as unknown as Dispatch<SetStateAction<string | null>>,
  );
