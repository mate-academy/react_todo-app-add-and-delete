/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext, useState } from 'react';
import { TodoHeader } from '../TodoHeader/TodoHeader';
import { TodoList } from '../TodoList/TodoList';
import { TodoFooter } from '../TodoFooter/TodoFooter';
import { Status } from '../../types/FilterOptions';
import { TodosContext } from '../TodosContext/TodosContext';
import { Todo } from '../../types/Todo';
import { ErrorNotification } from '../ErrorNotification/ErrorNotification';

export const TodoApp: React.FC = () => {
  const { todos } = useContext(TodosContext);
  const [filter, setFilter] = useState(Status.All);

  const filterTodos = (currentTodos: Todo[], filterType: Status) => {
    let filteredTodos = [...currentTodos];

    if (filterType !== Status.All) {
      if (filterType === Status.Active) {
        filteredTodos = filteredTodos.filter(item => !item.completed);
      } else {
        filteredTodos = filteredTodos.filter(item => item.completed);
      }
    }

    return filteredTodos;
  };

  const filteredTodos = filterTodos(todos, filter);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader />

        <TodoList items={filteredTodos} />

        {todos.length ? (
          <TodoFooter
            currentFilter={filter}
            onFilterChange={setFilter}
          />
        ) : (null)}
      </div>

      <ErrorNotification />
    </div>
  );
};
