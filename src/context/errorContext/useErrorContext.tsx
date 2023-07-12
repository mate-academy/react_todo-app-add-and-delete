import { useContext } from 'react';
import { ErrorContext } from './errorContext';

export const useErrorContext = () => useContext(ErrorContext);
