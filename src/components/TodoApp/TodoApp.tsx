import React, { useContext } from 'react';
// import { UserWarning } from './UserWarning';
import { TodoList } from '../TodoList';
import { Footer } from '../Footer';
import { Header } from '../Header';
import { Errors } from '../Errors';
import { TodosContext } from '../TodosProvider';
import { FilterType } from '../../types/FilterType';

export const TodoApp: React.FC = () => {
  const { todosFromServer, filter }
    = useContext(TodosContext);

  return (
    <>
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header />
        <TodoList />
        {(todosFromServer.length > 0 || filter !== FilterType.all) && (
          <Footer />
        )}
      </div>
      <Errors />
    </>
  );
};
