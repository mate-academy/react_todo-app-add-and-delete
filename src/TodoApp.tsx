/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext, useState } from 'react';

import { TodoList } from './components/TodoList/TodoList';
import { USER_ID } from './api/todos';
import { Filtering } from './types/Filtering';
import { UserWarning } from './UserWarning';
import { Footer } from './components/footer/Footer';
import { CustomError } from './components/error/CustomError';
import { MyContext, MyContextData } from './components/context/myContext';
import { CustomHeader } from './components/header/CustomHeader';

export const TodoApp: React.FC = () => {
  const { data } = useContext(MyContext) as MyContextData;

  const [fitlerType, setFilterType] = useState(Filtering.ALL);

  const hasItems = data.length > 0;

  const filtering = (type: Filtering) => {
    switch (type) {
      case Filtering.ACTIVE:
        return data.filter(todo => !todo.completed);
      case Filtering.COMPLETED:
        return data.filter(todo => todo.completed);
      default:
        return data;
    }
  };

  const handleClick = (filterType: Filtering) => {
    setFilterType(filterType);
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <CustomHeader />
        {hasItems && (
          <>
            <TodoList data={filtering(fitlerType)} />

            <Footer filterType={fitlerType} handleClick={handleClick} />
          </>
        )}
      </div>
      <CustomError />
    </div>
  );
};
