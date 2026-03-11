/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import * as postService from './api/todos';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ErrorMessage } from './types/ErrorMessage';
import { Filter } from './types/Filter';
import { TodoList } from './components/TodoList';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage | null>(null);
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [title, setTitle] = useState('');
  const [deletingTodoIds, setDeletingTodoIds] = useState<number[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);

  const loadTodos = async () => {
    try {
      const todosFromServer = await postService.getTodos();

      setTodos(todosFromServer);
    } catch {
      setErrorMessage(ErrorMessage.LoadTodos);
    }
  };

  const filteredTodos = todos.filter((todo: Todo) => {
    if (filter === Filter.Active) {
      return !todo.completed;
    }

    if (filter === Filter.Completed) {
      return todo.completed;
    }

    return true;
  });

  const onFilterChange = (value: Filter) => {
    setFilter(value);
  };

  const onTitleChange = (newTitle: string) => {
    setTitle(newTitle);
  };

  const handleErrorClose = () => {
    setErrorMessage(null);
  };

  const deleteTodo = async (todoId: number) => {
    setErrorMessage(null);

    try {
      setDeletingTodoIds(prev => [...prev, todoId]);
      await postService.deleteTodo(todoId);
      setTodos(prev => prev.filter(todo => todo.id !== todoId));
    } finally {
      setDeletingTodoIds(prev => prev.filter(id => id !== todoId));
    }
  };

  const handleDeleteOneTodo = async (todoId: number) => {
    setErrorMessage(null);

    try {
      await deleteTodo(todoId);
    } catch {
      setErrorMessage(ErrorMessage.DeleteTodo);
    }
  };

  const handleClearCompleted = async () => {
    setErrorMessage(null);

    const completeTodoIds = todos
      .filter(completedTodo => completedTodo.completed)
      .map(completedTodo => completedTodo.id);

    const results = await Promise.allSettled(
      completeTodoIds.map(id => deleteTodo(id)),
    );

    const hasRejected = results.some(result => result.status === 'rejected');

    if (hasRejected) {
      setErrorMessage(ErrorMessage.DeleteTodo);
    }
  };

  const addTodo = async (newTitle: string) => {
    setErrorMessage(null);

    const clearTitle = newTitle.trim();

    if (clearTitle.length === 0) {
      setErrorMessage(ErrorMessage.EmptyTitle);

      return;
    }

    const temporaryTodo: Todo = {
      id: 0,
      userId: postService.USER_ID,
      title: clearTitle,
      completed: false,
    };

    try {
      setIsSubmitting(true);
      setTempTodo(temporaryTodo);
      const newTodo = await postService.createTodo(clearTitle);

      setTodos(prev => [...prev, newTodo]);
      setTitle('');
    } catch {
      setErrorMessage(ErrorMessage.AddTodo);
    } finally {
      setIsSubmitting(false);
      setTempTodo(null);
    }
  };

  useEffect(() => {
    if (!isSubmitting && deletingTodoIds.length === 0) {
      inputRef.current?.focus();
    }
  }, [isSubmitting, deletingTodoIds]);

  useEffect(() => {
    loadTodos();
  }, []);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timer = setTimeout(() => setErrorMessage(null), 3000);

    return () => clearTimeout(timer);
  }, [errorMessage]);

  if (!postService.USER_ID) {
    return <UserWarning />;
  }

  const activeTodos = todos.filter(todo => !todo.completed);
  const activeTodosCount = activeTodos.length;
  const completedTodosCount = todos.length - activeTodosCount;
  const allTodosCompleted = activeTodosCount === 0 && todos.length !== 0;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          allTodosCompleted={allTodosCompleted}
          title={title}
          onTitleChange={onTitleChange}
          addTodo={addTodo}
          isSubmitting={isSubmitting}
          inputRef={inputRef}
        />

        <TodoList
          visibleTodos={filteredTodos}
          tempTodo={tempTodo}
          handleDeleteTodo={handleDeleteOneTodo}
          deletingTodoIds={deletingTodoIds}
        />

        {todos.length !== 0 && (
          <Footer
            activeTodosCount={activeTodosCount}
            completedTodosCount={completedTodosCount}
            filter={filter}
            onFilterChange={onFilterChange}
            handleClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        onClose={handleErrorClose}
      />
    </div>
  );
};
