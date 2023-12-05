/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect } from 'react';
import { UserWarning } from './UserWarning';
import { TodoFooter } from './components/TodoFooter/TodoFooter';
import { TodoHeader } from './components/TodoHeader/TodoHeader';
import { TodoList } from './components/TodoList/TodoList';
import * as todoService from './api/todos';
import { Todo } from './types/Todo';
import { TodoError } from './components/TodoError/TodoError';
import { Errors } from './types/Errors';
import { Filter } from './types/Filter';

const USER_ID = 10236;

const preparedTodos = (todosList: Todo[], selectedFilter: Filter): Todo[] => {
  let filteredTodos = [...todosList];

  switch (selectedFilter) {
    case 'Active':
      filteredTodos = todosList.filter(todo => !todo.completed);
      break;

    case 'Completed':
      filteredTodos = todosList.filter(todo => todo.completed);
      break;
    default:
      break;
  }

  return filteredTodos;
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterStatus, setFilterStatus] = useState<Filter>(Filter.All);
  const [errorType, setErrorType] = useState<Errors | null>(null);

  useEffect(() => {
    todoService.getTodos(USER_ID)
      .then(response => {
        setTodos(response);
      })
      .catch((error) => {
        throw error;
      });
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleDelete = (id: number) => {
    todoService.deleteTodo(id);
    setTodos(currentTodos => currentTodos.filter(post => post.id !== id));
  };

  const addTodo = (title: string) => {
    const newTodo = {
      title,
      completed: false,
      userId: USER_ID,
    };

    setTodos(currentTodos => {
      const maxId = Math.max(0, ...currentTodos.map(post => post.id));
      const id = maxId + 1;

      return [...currentTodos, { ...newTodo, id }];
    });
  };

  const isThereCompleted = todos.some(todo => todo.completed);

  const filteredTodos = preparedTodos(todos, filterStatus);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          onAddTodo={addTodo}
        />

        <TodoList
          todos={filteredTodos}
          deleteTodo={handleDelete}
        />

        {/* Hide the footer if there are no todos */}
        {todos.length !== 0 && (
          <TodoFooter
            todos={todos}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            isCompleted={isThereCompleted}
            setTodos={setTodos}
          />
        )}

      </div>

      {/* Notification is shown in case of any error */}
      {errorType && (
        <TodoError
          errorType={errorType}
          setErrorType={setErrorType}
        />
      )}

      {/* Add the 'hidden' class to hide the message smoothly */}
    </div>
  );
};
