/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { getTodos } from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';

export enum ErrorType {
  TodosLoad = 'Unable to load todos',
  EmptyTitle = 'Title should not be empty',
  UnableToAddTodo = 'Unable to add a todo',
  UnableToDeleteTodo = 'Unable to delete a todo',
  UnableToUpdateTodo = 'Unable to update a todo',
}

export enum Filter {
  all = 'All',
  active = 'Active',
  completed = 'Completed',
}

export const App: React.FC = () => {
  const [isTodoEditing, setIsTodoEditing] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(0);
  const [currentError, setCurrentError] = useState<ErrorType | ''>('');
  const [selectedFilter, setSelectedFilter] = useState(Filter.all);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteAllPressed, setIsDeleteAllPressed] = useState(false);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setCurrentError(ErrorType.TodosLoad);
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

  const activeTodos: number = [...todos].filter(
    (todo: Todo) => !todo.completed,
  ).length;

  const completedTodos: number = [...todos].filter(
    (todo: Todo) => todo.completed,
  ).length;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          completedTodos={completedTodos}
          setTodos={setTodos}
          setCurrentError={setCurrentError}
          setTempTodo={setTempTodo}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
        <TodoList
          selectedFilter={selectedFilter}
          visibleTodos={todos}
          isTodoEditing={isTodoEditing}
          selectedPostId={selectedPostId}
          setIsTodoEditing={setIsTodoEditing}
          setSelectedPostId={setSelectedPostId}
          tempTodo={tempTodo}
          setTodos={setTodos}
          setCurrentError={setCurrentError}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          isDeleteAllPressed={isDeleteAllPressed}
        />
        {!!todos.length && (
          <Footer
            activeTodos={activeTodos}
            selectedFilter={selectedFilter}
            setSelectedFilter={setSelectedFilter}
            completedTodos={completedTodos}
            todos={todos}
            setTodos={setTodos}
            setCurrentError={setCurrentError}
            setIsLoading={setIsLoading}
            setIsDeleteAllPressed={setIsDeleteAllPressed}
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
