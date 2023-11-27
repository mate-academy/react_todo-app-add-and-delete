import React, { useContext, useMemo } from 'react';
import { FilterBy } from '../types/FilterBy';
import { TodosContext } from './TodoContext';
import { ErrorNotification } from './ErrorNotification';
import { Footer } from './Footer';
import { Header } from './Header';
import { TempTodo } from './TempTodo';
import { TodoList } from './TodoList';

export const TodoApp: React.FC = () => {
  const { todos, filterBy, tempTodo } = useContext(TodosContext);

  const visibleTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (filterBy) {
        case FilterBy.Active:
          return !todo.completed;
        case FilterBy.Completed:
          return todo.completed;
        default:
          return true;
      }
    });
  }, [todos, filterBy]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header />

        <section className="todoapp__main" data-cy="TodoList">
          <TodoList todos={visibleTodos} />

          {tempTodo && (
            <TempTodo />
          )}
        </section>

        {todos.length > 0 && (
          <Footer />
        )}
      </div>

      <ErrorNotification />
    </div>
  );
};
