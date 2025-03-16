/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';

import { UserWarning } from './UserWarning';

import * as todoServices from './api/todos';
import { filterTodos } from './services/todoFunction';

import { Todo } from './types/Todo';
import { Filter, ErrorMassages } from './enum';

import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorMassage } from './components/ErrorMassage';

export const App: React.FC = () => {
  const [errorMassage, setErrorMassage] = useState('');
  const [todos, setTodos] = useState<Todo[] | []>([]);
  const [filterData, setFilterData] = useState<Filter>(Filter.All);
  const [isLoadTodo, setIsLoadTodo] = useState(false);
  const [tempTodo, setTempoTodo] = useState<Todo | null>(null);
  const [deletedIds, setDeletedIds] = useState<number[]>([]);

  useEffect(() => {
    todoServices
      .getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMassage(ErrorMassages.UnableToLoad);
      });
  }, []);

  const handleAddTodo = (title: string) => {
    if (title.length === 0) {
      setErrorMassage(ErrorMassages.EmptyTitle);

      return;
    }

    setIsLoadTodo(true);
    setTempoTodo({
      id: 0,
      userId: todoServices.USER_ID,
      title,
      completed: false,
    });
    todoServices
      .createTodos({
        title,
        userId: todoServices.USER_ID,
        completed: false,
      })
      .then(newTodo => {
        setTodos(currentTodos => [...(currentTodos || []), newTodo]);
      })
      .catch(() => {
        setErrorMassage(ErrorMassages.UnableToAdd);
      })
      .finally(() => {
        setIsLoadTodo(false);
        setTempoTodo(null);
      });
  };

  const handleDeleteTodo = (todosId: number[]) => {
    setDeletedIds(todosId);
    todosId.map(todoId => {
      todoServices
        .deleteTodos(todoId)
        .then(() => {
          setTodos(currentTodos =>
            currentTodos?.filter(todo => todo.id !== todoId),
          );
        })
        .catch(() => {
          setErrorMassage(ErrorMassages.UnableToDelete);
        })
        .finally(() => setDeletedIds([]));
    });
  };

  const hideError = () => {
    setErrorMassage('');
  };

  if (errorMassage.length > 0) {
    setTimeout(() => {
      setErrorMassage('');
    }, 3000);
  }

  const handleFilterData = (data: Filter) => {
    setFilterData(data);
  };

  const filteredTodos = todos ? filterTodos(todos, filterData) : [];

  if (!todoServices.USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          onTitle={handleAddTodo}
          todos={todos}
          loading={isLoadTodo}
          error={errorMassage}
        />
        {!!filteredTodos.length && (
          <TodoList
            todos={filteredTodos}
            deleteTodo={handleDeleteTodo}
            tempTodo={tempTodo}
            deletedIds={deletedIds}
          />
        )}
        {!!todos.length && (
          <Footer
            filterData={handleFilterData}
            todos={todos}
            deleteTodos={handleDeleteTodo}
          />
        )}
      </div>
      <ErrorMassage errorMassage={errorMassage} hideError={hideError} />
    </div>
  );
};
