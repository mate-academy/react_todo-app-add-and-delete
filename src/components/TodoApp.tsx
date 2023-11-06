import React, { useContext } from 'react';
import { Header } from './Header';
import { TodoList } from './TodoList';
import { Footer } from './Footer';
import { TodosContext } from '../context/TodosContext';
import { Error } from './Error';

export const TodoApp: React.FC = () => {
  const { todos } = useContext(TodosContext);

  const isContentDisplayed = todos.length > 0;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">

        <Header />

        {isContentDisplayed && (
          <>
            <TodoList />

            <Footer />
          </>
        )}
      </div>

      <Error />
    </div>
  );
};
