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
    case Filter.Active:
      filteredTodos = todosList.filter(todo => !todo.completed);
      break;

    case Filter.Completed:
      filteredTodos = todosList.filter(todo => todo.completed);
      break;
    default:
      return filteredTodos;
  }

  return filteredTodos;
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterStatus, setFilterStatus] = useState<Filter>(Filter.All);
  const [errorType, setErrorType] = useState<Errors | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processingTodoIds, setProcessingTodoIds] = useState<number[]>([]);
  const [todoTitle, setTodoTitle] = useState('');

  useEffect(() => {
    todoService.getTodos(USER_ID)
      .then(response => {
        setTodos(response);
      });
  }, []);

  const handleDelete = (id: number) => {
    setProcessingTodoIds(prevIds => [...prevIds, id]);
    todoService.deleteTodo(id)
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
    todoService.addTodo({
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
      .catch(() => setErrorType(Errors.Add))
      .finally(() => {
        setIsLoading(false);
        setProcessingTodoIds(prevIds => [...prevIds]
          .filter(prevId => prevId !== 0));
      });
  };

  const updateTodo = (updatedTodo: Todo) => {
    setProcessingTodoIds(currentTodos => [...currentTodos, updatedTodo.id]);

    todoService.updateTodo(updatedTodo)
      .then(() => setTodos(prev => (
        prev.map(prevTodo => (
          prevTodo.id === updatedTodo.id
            ? updatedTodo
            : prevTodo
        ))
      )))
      .catch(() => setErrorType(Errors.Update))
      .finally(() => {
        setProcessingTodoIds(currentTodos => currentTodos
          .filter(todoId => updatedTodo.id !== todoId));
      });
  };

  const toggleAll = async () => {
    const isAllCompleted = todos.every(todo => todo.completed);

    const todosToUpdate = todos.filter(todo => (isAllCompleted
      ? todo.completed
      : !todo.completed
    ));

    await Promise.all(todosToUpdate.map(todo => (
      updateTodo({
        ...todo,
        completed: !isAllCompleted,
      })
    )));
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  const isThereCompleted = todos.some(todo => todo.completed);

  const filteredTodos = preparedTodos(todos, filterStatus);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          todoTitle={todoTitle}
          setTodoTitle={setTodoTitle}
          todos={todos}
          isLoading={isLoading}
          onAddTodo={addTodo}
          setError={setErrorType}
          onToggleAll={toggleAll}
        />

        <TodoList
          todos={filteredTodos}
          tempTodo={tempTodo}
          onDeleteTodo={handleDelete}
          processingTodoIds={processingTodoIds}
          onUpdateTodo={updateTodo}
        />

        {todos.length !== 0 && (
          <TodoFooter
            todos={todos}
            filterStatus={filterStatus}
            onSetFilter={setFilterStatus}
            isCompleted={isThereCompleted}
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
