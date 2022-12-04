import React, {
  useContext, useEffect, useRef, useState, useMemo,
} from 'react';
import { Todo } from './types/Todo';
import { Status } from './types/Status';
import * as todoAPI from './api/todos';

import { AuthContext } from './components/Auth/AuthContext';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<Status>(Status.All);
  const [errorMessage, setErrorMessage] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [addingTitle, setAddingTitle] = useState('');
  const [processingTodos, setProcessingTodos] = useState<number[]>([]);

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    setErrorMessage('');

    todoAPI.getTodos(user.id)
      .then(setTodos)
      .catch(() => setErrorMessage('Unable to load todos for such user'));
  }, [user?.id]);

  const activeTodos = useMemo(() => {
    return todos.filter(todo => !todo.completed);
  }, [todos]);

  const completedTodos = useMemo(() => {
    return todos.filter(todo => todo.completed);
  }, [todos]);

  const visibleTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (selectedStatus) {
        case Status.Completed:
          return todo.completed;

        case Status.Active:
          return !todo.completed;

        case Status.All:
        default:
          return true;
      }
    });
  }, [todos, selectedStatus]);

  const addProcessingTodo = (todoIdToAdd: number) => {
    setProcessingTodos(current => [...current, todoIdToAdd]);
  };

  const removeProcessingTodo = (todoIdToRemove: number) => {
    setProcessingTodos(current => current.filter(id => id !== todoIdToRemove));
  };

  const deleteTodo = async (todoId: number) => {
    addProcessingTodo(todoId);
    setErrorMessage('');

    todoAPI.deleteTodo(todoId)
      .then(() => {
        setTodos(current => current.filter(todo => todo.id !== todoId));
      })
      .catch(() => setErrorMessage('Unable to delete a todo'))
      .finally(() => removeProcessingTodo(todoId));
  };

  const clearCompleted = () => {
    completedTodos.forEach(({ id }) => deleteTodo(id));
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          newTodoField={newTodoField}
          todos={todos}
          onTodos={setTodos}
          isAdding={isAdding}
          onIsAdding={setIsAdding}
          onAddingTitle={setAddingTitle}
          onErrorMessage={setErrorMessage}
        />

        <TodoList
          todos={visibleTodos}
          isAdding={isAdding}
          processingTodos={processingTodos}
          addingTitle={addingTitle}
          handleDeleteTodo={deleteTodo}
        />

        {(todos.length > 0 || isAdding) && (
          <Footer
            activeTodos={activeTodos}
            completedTodos={completedTodos}
            selectedStatus={selectedStatus}
            onSelectedStatus={setSelectedStatus}
            clearCompleted={clearCompleted}
          />
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        onErrorMessage={setErrorMessage}
      />
    </div>
  );
};
