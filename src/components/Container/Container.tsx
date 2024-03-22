/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext } from 'react';
import { TodoList } from '../TodoList/TodoList';
import { Header } from '../Header/Header';
import { Footer } from '../Footer/Footer';
import { TodoContext } from '../Store/TodoContext';

export const Conatainer: React.FC = () => {
  const { todos } = useContext(TodoContext);

  return (
    <div className="todoapp__content">
      <Header />
      <TodoList />

      {/* Hide the footer if there are no todos */}
      {!!todos.length && <Footer />}
    </div>
  );
};
