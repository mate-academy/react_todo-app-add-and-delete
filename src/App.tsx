import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import * as todoService from './api/todos';
import { Todo } from './types/Todo';
import { SORTFIELD } from './types/SortField';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { TodoList } from './components/TodoList';
import { ErrorNotification } from './components/ErrorNotification';
import { getVisibleTodos } from './helpers/helper';
import { Processing } from './types/Processing';
import { ErrorTypes } from './types/ErrorType';

export const App: React.FC = () => {
  const [sortField, setSortField] = useState<SORTFIELD>(SORTFIELD.ALL);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [title, setTitle] = useState('');

  const [isProcessing, setIsProcessing] = useState<Processing>({
    editing: null,
    submitting: null,
    deleting: [],
  });

  const showError = (message: string) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  };

  useEffect(() => {
    todoService
      .getTodos()
      .then(setTodos)
      .catch(() => {
        showError(ErrorTypes.getError);
      });
  }, []);

  if (!todoService.USER_ID) {
    return <UserWarning />;
  }

  const deleteTodo = (todoId: number) => {
    setErrorMessage('');

    return todoService
      .deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(currentTodo => currentTodo.id !== todoId),
        );
      })
      .catch(error => {
        setTodos(todos);
        showError(ErrorTypes.deleteError);

        throw error;
      });
  };

  const createTodo = (todo: Todo) => {
    setErrorMessage('');

    const temporaryTodo: Todo = {
      id: 0,
      userId: todoService.USER_ID,
      title,
      completed: false,
    };

    setTempTodo(temporaryTodo);

    return todoService
      .createTodo(todo)
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setTempTodo(null);
      })
      .catch(error => {
        setTempTodo(null);
        showError(ErrorTypes.postError);

        throw error;
      });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          onSubmit={createTodo}
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
          title={title}
          setTitle={setTitle}
          isProcessing={isProcessing}
          setIsProcessing={setIsProcessing}
        />

        <TodoList
          todos={getVisibleTodos(todos, sortField)}
          onDelete={deleteTodo}
          isProcessing={isProcessing}
          setIsProcessing={setIsProcessing}
        />

        {tempTodo && (
          <TodoList
            todos={[tempTodo]}
            onDelete={() => Promise.resolve()}
            isProcessing={isProcessing}
            setIsProcessing={setIsProcessing}
          />
        )}

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <Footer
            todos={todos}
            sortField={sortField}
            setSortField={setSortField}
            onDelete={deleteTodo}
            setIsProcessing={setIsProcessing}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <ErrorNotification
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
