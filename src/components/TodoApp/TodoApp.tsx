import React, { useContext } from 'react';

import Header from '../Header';
import Main from '../Main';
import Footer from '../Footer';
import Notification from '../Notification';
import { TodosContext } from '../../contexts/TodosContext';

export const TodoApp: React.FC = () => {
  const { todos } = useContext(TodosContext);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header />

        {todos.length > 0 && (
          <>
            <Main />

            <Footer />
          </>
        )}
      </div>

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <Notification />
    </div>
  );
};
