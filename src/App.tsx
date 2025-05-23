import React, { useEffect, useState } from 'react';

import {
  createTodo,
  deleteTodo,
  getTodos,
  updateTodo,
  USER_ID,
} from './api/todos';
import { TodoList } from './components/TodoList/TodoList';
import { ErrorType } from './types/ErrorType';
import { Filter } from './utils/Filter';
import { Todo } from './types/Todo';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { UserWarning } from './UserWarning';

export const App: React.FC = () => {
  const [isTodoEditing, setIsTodoEditing] = useState(false);
  const [selectedPostId, setIsSelectedPostId] = useState(0);
  const [currentError, setCurrentError] = useState<ErrorType | ''>('');
  const [selectedFilter, setSelectedFilter] = useState(Filter.all);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processingTodoIds, setProcessingTodoIds] = useState<number[]>([]);
  const [shouldFocusInput, setShouldFocusInput] = useState(false);

  useEffect(() => {
    const loadTodos = async () => {
      try {
        const todosFromServer = await getTodos();

        setTodos(todosFromServer);
      } catch {
        setCurrentError(ErrorType.TodosLoad);
      }
    };

    loadTodos();
  }, []);

  const handleTodoAdd = async (newTodo: Todo) => {
    try {
      setTempTodo({
        ...newTodo,
        id: 0,
      });
      const createdTodo = await createTodo(newTodo);

      setTodos(currentTodos => [...currentTodos, createdTodo]);

      return true;
    } catch {
      setCurrentError(ErrorType.UnableToAddTodo);
      throw new Error(ErrorType.UnableToAddTodo);
    } finally {
      setTempTodo(null);
    }
  };

  const handleTodoDelete = async (todoId: number) => {
    setProcessingTodoIds(current => [...current, todoId]);

    try {
      await deleteTodo(todoId);

      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
      setShouldFocusInput(true);
    } catch {
      setCurrentError(ErrorType.UnableToDeleteTodo);
    } finally {
      setProcessingTodoIds(current => current.filter(id => id !== todoId));
    }
  };

  const handleTodoUpdate = async (updatedTodo: Todo) => {
    try {
      await updateTodo(updatedTodo);

      setTodos(currentTodos =>
        currentTodos.map(todo =>
          todo.id === updatedTodo.id ? updatedTodo : todo,
        ),
      );
    } catch {
      setCurrentError(ErrorType.UnableToUpdateTodo);
    }
  };

  const handleClearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    const deletePromises = completedTodos.map(todo => {
      return deleteTodo(todo.id)
        .then(() => ({ id: todo.id, success: true }))
        .catch(() => ({ id: todo.id, success: false }));
    });

    setProcessingTodoIds(completedTodos.map(todo => todo.id));

    const results = await Promise.all(deletePromises);

    const deletedSuccess = results
      .filter(result => result.success)
      .map(result => result.id);

    if (results.some(result => !result.success)) {
      setCurrentError(ErrorType.UnableToDeleteTodo);
    }

    setTodos(current =>
      current.filter(todo => !deletedSuccess.includes(todo.id)),
    );
    setProcessingTodoIds([]);

    if (deletedSuccess.length > 0) {
      setShouldFocusInput(true);
    }
  };

  useEffect(() => {
    if (!currentError) {
      return;
    }

    const timer = setTimeout(() => {
      setCurrentError('');
    }, 3000);

    return () => clearTimeout(timer);
  }, [currentError]);

  useEffect(() => {
    if (shouldFocusInput) {
      setShouldFocusInput(false);
    }
  }, [shouldFocusInput]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const activeTodos: number = todos.filter(
    (todo: Todo) => !todo.completed,
  ).length;

  const completedTodos: number = todos.filter(
    (todo: Todo) => todo.completed,
  ).length;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <Header
        todos={todos}
        completedTodos={completedTodos}
        setCurrentError={setCurrentError}
        onTodoAdd={handleTodoAdd}
        focusInput={shouldFocusInput}
      />

      <div className="todoapp__content">
        <TodoList
          selectedFilter={selectedFilter}
          visibleTodos={todos}
          isTodoEditing={isTodoEditing}
          selectedPostId={selectedPostId}
          setIsTodoEditing={setIsTodoEditing}
          setSelectedPostId={setIsSelectedPostId}
          onDelete={handleTodoDelete}
          onUpdate={handleTodoUpdate}
          tempTodo={tempTodo}
          processingTodoIds={processingTodoIds}
        />

        {!!todos.length && (
          <Footer
            activeTodos={activeTodos}
            selectedFilter={selectedFilter}
            setSelectedFilter={setSelectedFilter}
            completedTodos={completedTodos}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <ErrorNotification
        currentError={currentError}
        setCurrentError={setCurrentError}
      />
    </div>
  );
};
