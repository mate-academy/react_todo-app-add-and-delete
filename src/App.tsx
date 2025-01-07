/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, USER_ID } from './api/todos';
import { TodoHeader } from './components/TodoHeader/TodoHeader';
import { TodoElements } from './components/TodoElements/TodoElements';
import { TodoFooter } from './components/TodoFooter/TodoFooter';
import { ErrorMesage } from './components/ErrorMesage/ErrorMesage';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  if (!USER_ID) {
    return <UserWarning />;
  }

  const [todosArr, setTodosArr] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<boolean | ''>('');
  const [errorMesage, setErrorMesage] = useState<string>('');

  useEffect(() => {
    getTodos().then(setTodosArr);
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          setErrorMesage={setErrorMesage}
          addNewTodo={setTodosArr}
          todos={todosArr}
        />

        <TodoElements
          changeTodos={setTodosArr}
          setErrorMesage={setErrorMesage}
          todos={todosArr}
          filter={filter}
        />

        {/* Hide the footer if there are no todos */}
        {todosArr.length > 0 ? (
          <TodoFooter
            cleanTodos={setTodosArr}
            setFilter={setFilter}
            setErrorMesage={setErrorMesage}
            filter={filter}
            todos={todosArr}
          />
        ) : null}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <ErrorMesage setErrorMesage={setErrorMesage} errorMesage={errorMesage} />
    </div>
  );
};
