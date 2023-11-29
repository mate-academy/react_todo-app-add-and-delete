import React, { useContext } from 'react';
import { TodosContext } from '../TodosContext/TodosContext';
import { Header } from '../Header/Header';
import { Main } from '../Main/Main';
import { Footer } from '../Footer/Footer';
import { Error } from '../Eror/Error';

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
      <Error />
    </div>
  );
};
