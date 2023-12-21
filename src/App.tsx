/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect } from 'react';
import { UserWarning } from './UserWarning';

import { Footer } from './components/Footer';
import { TodoError } from './components/TodoError';
import { TodoList } from './components/TodoList';

import * as TodoService from './api/todos';

import { Todo } from './types/Todo';
import { Error } from './types/Error';
import { Filter } from './types/Filter';
import { Header } from './components/Header';

const USER_ID = 12062;

const prepareTodos = (todosList: Todo[], selectedFilter: Filter): Todo[] => {
  let filteredTodos = [...todosList];

  switch (selectedFilter) {
    case Filter.Active:
      filteredTodos = todosList.filter(todo => !todo.completed);
      break;
    case Filter.Completed:
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
  const [errorType, setErrorType] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processingTodoIds, setProcessingTodoIds] = useState<number[]>([]);
  const [todoTitle, setTodoTitle] = useState('');

  useEffect(() => {
    TodoService.getTodos(USER_ID)
      .then(response => {
        setTodos(response);
      })
      .catch((error) => {
        throw error;
      });
  }, []);

  // const addTodo = useCallback(
  //   async (fields: CreateTodoField): Promise<void> => {
  //     const newTodo = await TodoApi.createTodo(fields);

  //     setTodos((prevTodos) => [...prevTodos, newTodo]);
  //   },
  //   [],
  // );
  const handleDelete = (id: number) => {
    setProcessingTodoIds(prevIds => [...prevIds, id]);
    TodoService.deleteTodo(id)
      .then(() => {
        setTimeout(() => {
          setTodos(currentTodos => currentTodos.filter(post => post.id !== id));
        }, 500);
      })
      .finally(() => setTimeout(() => {
        setProcessingTodoIds(prevIds => [...prevIds]
          .filter(prevId => prevId !== id));
      }, 500));
  };

  const addTodo = (title: string) => {
    setIsLoading(true);
    setProcessingTodoIds(prevIds => [...prevIds, 0]);
    setTempTodo({
      id: 0,
      title,
      completed: false,
      userId: USER_ID,
    });
    TodoService.createTodo({
      title,
      completed: false,
      userId: USER_ID,
    })
      .then(newTodo => {
        setTodoTitle('');
        setTimeout(() => {
          setTodos(currentTodos => {
            return [...currentTodos, newTodo];
          });
          setTempTodo(null);
        }, 500);
      })
      .finally(() => {
        setIsLoading(false);
        setProcessingTodoIds(prevIds => [...prevIds]
          .filter(prevId => prevId !== 0));
      });
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  const isCompleted = todos.some(todo => todo.completed);

  const filteredTodos = prepareTodos(todos, filterStatus);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todoTitle={todoTitle}
          setTodoTitle={setTodoTitle}
          todos={todos}
          isLoading={isLoading}
          onAddTodo={addTodo}
          setError={setErrorType}
        />

        <TodoList
          todos={filteredTodos}
          tempTodo={tempTodo}
          onDeleteTodo={handleDelete}
          processingTodoIds={processingTodoIds}
        />

        {todos.length !== 0 && (
          <Footer
            todos={todos}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            isCompleted={isCompleted}
            onDeleteTodo={handleDelete}
          />
        )}
      </div>

      {errorType && (
        <TodoError
          errorType={errorType}
          setErrorType={setErrorType}
        />
      )}

    </div>
  );
};
