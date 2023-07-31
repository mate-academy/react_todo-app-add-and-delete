/* eslint-disable import/no-cycle */
import React, { useContext } from 'react';
import { TodosContext } from '../../context/TodosContext';
import { TodoList } from '../TodoList';
import { Footer } from '../Footer';
import { ErrorComponent } from '../ErrorComponent';
import { Header } from '../Header';
import { filterTodo } from '../../helpers/filterTodo';
import { TempTodoItem } from '../TempTodoItem';

export const AppBody: React.FC = () => {
  const { todos, sortField, tempTodo } = useContext(TodosContext);

  const visibleTodos = filterTodo(todos, sortField);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header />

        {todos.length > 0 && (
          <>
            <TodoList todos={visibleTodos} />
            {tempTodo && <TempTodoItem tempTodo={tempTodo} />}

            <Footer />
          </>
        )}
      </div>

      <ErrorComponent />
    </div>
  );
};
