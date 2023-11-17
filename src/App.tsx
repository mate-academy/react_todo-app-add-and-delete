/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import * as TodoServices from './api/todos';
import { TodoHeader } from './components/TodoHeader';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';
import { TodoErrors } from './components/TodoErrors';
import { ErrorType } from './types/ErrorType';

const USER_ID = 11682;

enum FilterValue {
  All = 'all',
  Completed = 'completed',
  Active = 'active',
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<ErrorType | null>(null);
  const [filterValue, setFilterValue] = useState<FilterValue>(FilterValue.All);

  useEffect(() => {
    TodoServices.getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setError(ErrorType.LoadError);
      });
  }, []);

  const addTodo = ({ title, userId, completed }: Todo) => {
    TodoServices.postTodos({ title, userId, completed })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
      });
  };

  const deletePost = (todoId: number) => {
    TodoServices.deleteTodos(todoId);
    setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
  };

  const filteredTodos = useMemo(() => {
    switch (filterValue) {
      case FilterValue.Active:
        return todos.filter(todo => todo.completed);
      case FilterValue.Completed:
        return todos.filter(todo => !todo.completed);
      default:
        return todos;
    }
  }, [todos, filterValue]);

  const handleFilterChange = (filter: FilterValue) => {
    setFilterValue(filter);
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  const clearCompleted = () => {
    TodoServices.deleteTodos(USER_ID);
    setTodos((currentTodos) => currentTodos.filter((todo) => todo.completed));
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          onSubmit={addTodo}
          USER_ID={USER_ID}
          setError={setError}
        />

        <TodoList todos={filteredTodos} deletePost={deletePost} />

        {/* Hide the footer if there are no todos */}
        <TodoFooter
          todos={filteredTodos}
          filterValue={filterValue}
          filterChange={handleFilterChange}
          clearCompleted={clearCompleted}
          setTodos={setTodos}
          setError={setError}
        />
      </div>

      <TodoErrors error={error} />
    </div>
  );
};
