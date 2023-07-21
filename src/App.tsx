/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { Todo } from './types/Todo';
import { createTodo, deleteTodo, getTodos } from './api/todos';
import { Footer } from './components/Footer/Footer';
import { Notification } from './components/Notification/Notification';
import { ErrorMessage } from './types/ErrorMessage';
import { FilterType } from './types/FilterType';

const USER_ID = 11085;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [loadingTodoId, setLoadingTodoId] = useState<number | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [
    errorMessage,
    setErrorMessage,
  ] = useState<ErrorMessage>(ErrorMessage.NoError);

  const fetchTodos = async () => {
    try {
      const fetchedTodos = await getTodos(USER_ID);

      setTodos(fetchedTodos);
    } catch (error) {
      setErrorMessage(ErrorMessage.FetchTodos);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const addTodo = async (title: string) => {
    if (!title.trim()) {
      setErrorMessage(ErrorMessage.EmptyTitle);

      return;
    }

    try {
      const newTempTodo: Todo = {
        id: 0,
        userId: USER_ID,
        title,
        completed: false,
      };

      setTempTodo(newTempTodo);

      const newTodo = await createTodo({
        userId: USER_ID,
        title,
        completed: false,
      });

      setTodos([...todos, newTodo]);
      setErrorMessage(ErrorMessage.NoError);
    } catch (error) {
      setErrorMessage(ErrorMessage.AddTodo);
    } finally {
      setTempTodo(null);
    }
  };

  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case 'all':
        return true;

      case 'active':
        return !todo.completed;

      case 'completed':
        return todo.completed;

      default:
        return false;
    }
  });

  const handleDeleteTodo = async (todoId: number) => {
    try {
      setLoadingTodoId(todoId);
      await deleteTodo(todoId);
      setTodos(todos.filter((todo) => todo.id !== todoId));
    } catch (error) {
      setErrorMessage(ErrorMessage.DeleteTodo);
    } finally {
      setLoadingTodoId(null);
    }
  };

  const clearCompletedTodos = async () => {
    const completedTodoIds = todos.filter(
      todo => todo.completed,
    ).map(todo => todo.id);

    if (completedTodoIds.length === 0) {
      return;
    }

    try {
      await Promise.all(completedTodoIds.map(id => deleteTodo(id)));
      setTodos(todos.filter((todo) => !todo.completed));
    } catch (error) {
      setErrorMessage(ErrorMessage.DeleteTodo);
    }
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  const completedCount = todos.filter(todo => todo.completed).length;

  const clearErrorMessage = () => {
    setErrorMessage(ErrorMessage.NoError);
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          addTodo={addTodo}
          setEmptyTitleError={setErrorMessage}
        />
        <TodoList
          todos={filteredTodos}
          onDeleteTodo={handleDeleteTodo}
          loadingTodoId={loadingTodoId}
          tempTodo={tempTodo}
        />

        <Footer
          todosCount={todos.length}
          completedCount={completedCount}
          filter={filter}
          setFilter={setFilter}
          onClearCompleted={clearCompletedTodos}
        />
      </div>

      {errorMessage && (
        <Notification
          errorMessage={errorMessage}
          onClose={clearErrorMessage}
        />
      )}
    </div>
  );
};
