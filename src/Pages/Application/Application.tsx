import React, { useContext } from 'react';

import { ApiErrorContext, TodosContext } from '../../Context';

// components
import { Header } from '../../Components/Header';
import { TodosList } from '../../Components/TodosList';
import { Footer } from '../../Components/Footer';
import { ApiError } from '../../Components/UI/ApiError';

export const Application: React.FC = () => {
  const { apiError } = useContext(ApiErrorContext);
  const { todos, tempTodo } = useContext(TodosContext);
  const isContentVisible = Boolean(todos.length) || Boolean(tempTodo);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <Header />

      {isContentVisible && (
        <div className="todoapp__content">
          <TodosList />

          <Footer />
        </div>
      )}

      {apiError && <ApiError />}
    </div>
  );
};
