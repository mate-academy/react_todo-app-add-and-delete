import React, { useContext } from 'react';
import { TodoList } from './components/TodoLIst/TodoLIst';
import { Footer } from './components/Footer/Footer';
import {
  ErrorNotification,
} from './components/ErrorNotification/ErrorNotification';
import { TodosContext } from './components/TodosContext/TodosContext';
import { Header } from './components/Header/Header';
import { FilterItem } from './types/FilterItem';

export const App: React.FC = () => {
  const { todos, filter } = useContext(TodosContext);

  const activeTodos = todos?.filter(todo => !todo.completed);
  const completedTodos = todos?.filter(todo => todo.completed);

  function getFilterTodos() {
    switch (filter) {
      case FilterItem.Active: {
        return activeTodos;
      }

      case FilterItem.Completed: {
        return completedTodos;
      }

      default:
        return todos;
    }
  }

  const visibleTodos = getFilterTodos();

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header />

        <TodoList todos={visibleTodos} />

        {!!todos?.length && (
          <Footer
            activeTodos={activeTodos?.length}
            completedTodos={completedTodos?.length}
          />
        )}
      </div>

      <ErrorNotification />
    </div>
  );
};
