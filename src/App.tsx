import React from 'react';
// import { UserWarning } from './UserWarning';
import { Footer } from './components/Footer';
import { Main } from './components/Main';
import { Header } from './components/Header';
import { TodosContextProvider } from './TodosContext';
import { Error } from './components/Error';

export const App: React.FC = () => {
  // if (!USER_ID) {
  //   return <UserWarning />;
  // }

  return (
    <div className="todoapp">
      <TodosContextProvider>
        <h1 className="todoapp__title">todos</h1>

        <div className="todoapp__content">
          <Header />
          <Main />
          <Footer />
        </div>

        <Error />
      </TodosContextProvider>
    </div>
  );
};
