/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext, useState } from 'react';
import { Status } from '../../types/FilterOptions';
import { Todo } from '../../types/Todo';

import { TodosContext } from '../TodosContext';
import { TodoHeader } from '../TodoHeader';
import { TodoList } from '../TodoList';
import { TodoFooter } from '../TodoFooter';
import { TempTodoItem } from '../TempTodoItem';
import { ErrorNotification } from '../ErrorNotification';

export const TodoApp: React.FC = () => {
  const { todos } = useContext(TodosContext);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
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
        <TodoHeader onTodoAdd={setTempTodo} />

        <TodoList items={filteredTodos} />

        {tempTodo && <TempTodoItem tempItem={tempTodo} />}

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
