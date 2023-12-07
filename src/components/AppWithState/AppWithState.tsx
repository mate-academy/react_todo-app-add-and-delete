import React from 'react';
import { AppStateProvider } from '../AppState/AppState';
import { App } from '../../App';

export const AppWithState: React.FC = () => {
  return (
    <AppStateProvider>
      <App />
    </AppStateProvider>
  );
};
