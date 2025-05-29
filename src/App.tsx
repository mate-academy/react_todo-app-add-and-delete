/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { getTodos, createTodo, deleteTodo } from './api/todos';
import { Todo } from './/types/Todo';

import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';

export enum Filter {
  all = 'All',
  active = 'Active',
  completed = 'Completed',
}

export enum ErrorType {
  TodosLoad = 'Unable to load todos',
  EmptyTitle = 'Title should not be empty',
  UnableToAddTodo = 'Unable to add a todo',
  UnableToDeleteTodo = 'Unable to delete a todo',
  UnableToUpdateTodo = 'Unable to update a todo',
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null); //???
  const [selectedFilter, setSelectedFilter] = useState(Filter.all);
  const [isTodoEditing, setIsTodoEditing] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(0);
  const [currentError, setCurrentError] = useState<ErrorType | ''>('');
  const [shouldFocusInput, setShouldFocusInput] = useState(false);
  const [processingTodoIds, setProcessingTodoIds] = useState<number[]>([]);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(error => {
        setCurrentError(ErrorType.TodosLoad);
        throw error;
      });
  }, []);

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

  async function handleTodoAdd(newTodo: Todo) {
    try {
      setTempTodo({
        ...newTodo,
        id: 0,
      });

      const createdTodo = await createTodo(newTodo);

      setTodos(currentTodos => [...currentTodos, createdTodo]);
      setShouldFocusInput(true);
    } catch {
      setCurrentError(ErrorType.UnableToAddTodo);
      throw new Error(ErrorType.UnableToAddTodo);
    } finally {
      setTempTodo(null);
    }
  }

  async function handleDeleteTodo(todoId: number) {
    try {
      await deleteTodo(todoId);
      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
      setShouldFocusInput(true);
    } catch {
      setCurrentError(ErrorType.UnableToDeleteTodo);
      throw new Error(ErrorType.UnableToDeleteTodo);
    }
  }

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

  const activeTodos: number = todos.filter(todo => !todo.completed).length;
  const completedtodos: number = todos.filter(todo => todo.completed).length;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header
          todos={todos}
          setTodos={setTodos}
          completedTodos={completedtodos}
          setCurrentError={setCurrentError}
          onTodoAdd={handleTodoAdd}
          shouldFocusInput={shouldFocusInput}
        />

        <TodoList
          selectedFilter={selectedFilter}
          todos={todos}
          isTodoEditing={isTodoEditing}
          selectedPostId={selectedPostId}
          setIsTodoEditing={setIsTodoEditing}
          setSelectedPostId={setSelectedPostId}
          tempTodo={tempTodo}
          onDelete={handleDeleteTodo}
          processingTodoIds={processingTodoIds}
        />

        {todos.length > 0 && (
          <Footer
            activeTodos={activeTodos}
            selectedFilter={selectedFilter}
            setSelectedFilter={setSelectedFilter}
            completedTodos={completedtodos}
            handleClearCompleted={handleClearCompleted}
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
