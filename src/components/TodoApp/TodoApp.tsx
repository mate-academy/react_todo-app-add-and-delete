import React, { useMemo } from 'react';
import { useTodos } from '../../TodosContext';

import { Status } from '../../types/Status';
import { Todo } from '../../types/Todo';
import { Footer } from '../Footer/Footer';
import { Header } from '../Header/Header';
import { TodoList } from '../TodoList/TodoList';
import { TodoNotification } from '../TodoNotification/TodoNotification';

export const TodoApp: React.FC = () => {
  const {
    todos,
    selectedStatus,
  } = useTodos();

  function filterTodos(items: Todo[], status: Status) {
    switch (status) {
      case Status.Active:
        return items.filter(item => !item.completed);

      case Status.Completed:
        return items.filter(item => item.completed);

      case Status.All:
      default:
        return items;
    }
  }

  const filteredTodos = useMemo(() => {
    return filterTodos(todos, selectedStatus);
  }, [todos, selectedStatus]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header />

        {todos.length > 0 && (
          <TodoList items={filteredTodos} />
        )}

        {todos.length > 0 && (<Footer />)}

      </div>

      <TodoNotification />

    </div>
  );
};
