import React, { useState, useEffect, useRef } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID, getTodos, deleteTodo, createTodo } from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { ErrorItem } from './components/ErrorItem';
import { FooterItem } from './components/Footer';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingTodoId, setDeletingTodoId] = useState<number | null>(null);

  useEffect(() => {
    if (inputRef.current && !isSubmitting) {
      inputRef.current.focus();
    }
  }, [todos, isSubmitting]);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage(null);
      }, 3000);

      return () => clearTimeout(timer);
    }

    return undefined;
  }, [errorMessage]);

  useEffect(() => {
    setErrorMessage(null);
    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage('Unable to load todos'));
  }, []);

  const hasAllTodosCompleted = todos.every(todo => todo.completed);
  const notCompletedTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleDeleteTodo = (todoId: number) => {
    setDeletingTodoId(todoId);
    deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
      })
      .finally(() => {
        setDeletingTodoId(null);
      });
  };

  const handleClearCompleted = () => {
    const deletePromises = completedTodos.map(todo =>
      handleDeleteTodo(todo.id),
    );

    Promise.all(deletePromises).catch(() => {
      setErrorMessage('Unable to delete one or more todos');
    });
  };

  const handleAddTodo = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedTitle = newTodoTitle.trim();

    if (!newTodoTitle.trim()) {
      setErrorMessage('Title should not be empty');

      return;
    }

    const tempTodoItem: Todo = {
      id: 0,
      title: newTodoTitle,
      completed: false,
      userId: USER_ID,
    };

    setTempTodo(tempTodoItem);
    setIsSubmitting(true);

    createTodo({
      title: trimmedTitle,
      userId: USER_ID,
      completed: false,
    })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setNewTodoTitle('');
      })
      .catch(() => setErrorMessage('Unable to add a todo'))
      .finally(() => {
        setIsSubmitting(false);
        setTempTodo(null);
      });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header
          hasAllTodosCompleted={hasAllTodosCompleted}
          handleAddTodo={handleAddTodo}
          newTodoTitle={newTodoTitle}
          setNewTodoTitle={setNewTodoTitle}
          inputRef={inputRef}
          isSubmitting={isSubmitting}
        />

        <TodoList
          todos={todos}
          filter={filter}
          isSubmitting={isSubmitting}
          deletingTodoId={deletingTodoId}
          tempTodo={tempTodo}
          onDelete={handleDeleteTodo}
        />

        {todos.length > 0 && (
          <FooterItem
            notCompletedTodos={notCompletedTodos}
            setFilter={setFilter}
            filter={filter}
            handleClearCompleted={handleClearCompleted}
            completedTodos={completedTodos}
          />
        )}
      </div>
      <ErrorItem
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
