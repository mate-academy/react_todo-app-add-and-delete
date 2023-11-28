import React, { useContext } from 'react';
import { Header } from './Header';
import { Todolist } from './TodoList';
import { Footer } from './Footer';
import { Error } from './Error';
import { TodoItem } from './TodoItem';
import { TodosContext } from '../TodosContext';
import { UserWarning } from '../UserWarning';

export const TodoApp: React.FC = () => {
  const {
    userId,
    tempTodo,
    todos,
    errorMassage,
    setErrorMassage,
  } = useContext(TodosContext);

  return userId ? (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header />

        {todos.length !== 0 && (
          <>
            <Todolist />

            {tempTodo && (
              <TodoItem todo={tempTodo} />
            )}
            <Footer />
          </>
        )}
      </div>

      <Error errorMassage={errorMassage} setError={setErrorMassage} />
    </div>
  ) : (
    <UserWarning />
  );
};
