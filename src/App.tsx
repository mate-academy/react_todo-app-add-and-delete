/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import * as todoService from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
import { ErrorMessage } from './components/ErrorMessage/ErrorMessage';
import { TodoStatusFilter } from './types/TodoStatusFilter';
import { getPreparedTodos } from './utils/getPreparedTodos';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [processingTodosId, setProcessingTodosId] = useState<number[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<TodoStatusFilter>(
    TodoStatusFilter.All,
  );
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const applyErrorForSomeTime = (errorText: string, delayToRemove = 3000) => {
    setErrorMessage(errorText);

    setTimeout(() => setErrorMessage(''), delayToRemove);
  };

  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const completedTodosCount = todos.filter(todo => todo.completed).length;
  const preparedTodos = getPreparedTodos(todos, selectedFilter);

  useEffect(() => {
    todoService
      .getTodos()
      .then(setTodos)
      .catch(() => applyErrorForSomeTime('Unable to load todos'));
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const addTodo = async ({ id, title, userId, completed }: Todo) => {
    try {
      if (title.length === 0) {
        throw new Error();
      }

      setTempTodo({ id, title, userId, completed });

      const returnedTodo = await todoService.postTodo({
        title,
        userId,
        completed,
      });

      setTodos(currentTodos => [...currentTodos, returnedTodo]);
    } catch (error) {
      if (title.length === 0) {
        applyErrorForSomeTime('Title should not be empty');
      } else {
        applyErrorForSomeTime('Unable to add a todo');
      }

      throw error;
    } finally {
      setTempTodo(null);
    }
  };

  const updateTodo = (todoToUpdate: Todo) => {
    return todoService
      .updateTodo(todoToUpdate)
      .then(() =>
        setTodos(currentTodos => {
          return currentTodos.map(todo =>
            todo.id === todoToUpdate.id ? todoToUpdate : todo,
          );
        }),
      )
      .catch(error => {
        applyErrorForSomeTime('Unable to update a todo');
        throw error;
      });
  };

  const deleteTodo = (todoId: number) => {
    setProcessingTodosId(currIds => [...currIds, todoId]);

    return todoService
      .deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(error => {
        applyErrorForSomeTime('Unable to delete a todo');
        throw error;
      })
      .finally(() => {
        setProcessingTodosId(currIds => currIds.filter(id => id !== todoId));
      });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          onAddTodo={addTodo}
          onUpdateTodosCompleted={updateTodo}
        />

        <TodoList
          todos={preparedTodos}
          processings={processingTodosId}
          tempTodo={tempTodo}
          onDeleteTodo={deleteTodo}
        />

        {todos.length > 0 && (
          <Footer
            selectedFilter={selectedFilter}
            setSelectedFilter={setSelectedFilter}
            activeTodosCount={activeTodosCount}
            completedTodosCount={completedTodosCount}
          />
        )}
      </div>

      <ErrorMessage
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
