import React, { useContext } from 'react';
import { TodosContext } from '../../context/TodosContext';
import { Footer } from '../Footer';
import { Header } from '../Header';
import { Main } from '../Main';

type Props = {};

export const TodoContent: React.FC<Props> = () => {
  const { todos } = useContext(TodosContext);

  return (
    <div className="todoapp__content">

      <Header />

      <Main />

      {todos.length !== 0 && (
        <Footer />
      )}

    </div>
  );
};
