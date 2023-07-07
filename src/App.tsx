import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import { deleteTodo, getTodos, postTodo } from './api/todos';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList/TodoList';
import { Notification } from './components/Notification';
import { getFilteredTodos } from './helpers';
import { FilterStatus } from './types/FilterStatus';
import { Todo } from './types/Todo';
import { USER_ID } from './consts/consts';
import './styles/todoapp.scss';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [title, setTitle] = useState('');
  const [statusFilter, setFilterStatus] = useState(FilterStatus.all);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsFetching] = useState(false);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(errorFromServer => setError(errorFromServer.message));
  }, []);

  useEffect(() => {
    let timerId: NodeJS.Timeout;

    if (error) {
      timerId = setTimeout(() => {
        setError(null);
      }, 3000);
    }

    return () => clearTimeout(timerId);
  }, [error]);

  const todosCount = todos.length;
  const areTodosVisible = todosCount > 0;

  const visibleTodos = useMemo(() => (
    getFilteredTodos(todos, statusFilter)
  ), [todos, statusFilter]);

  const completedTodos = useMemo(() => (
    todos.filter((todo) => todo.completed)
  ), [todos, statusFilter]);

  const activeTodos = useMemo(() => (
    todos.filter((todo) => !todo.completed)
  ), [todos, statusFilter]);

  const hasSomeActiveTodos = activeTodos.length > 0;
  const hasSomeCompletedTodos = completedTodos.length > 0;

  const changeFilterStatus = useCallback((filterStaus: FilterStatus) => {
    setFilterStatus(filterStaus);
  }, []);

  const closeNotifications = useCallback(() => setError(null), []);

  const changeNotification = (errorMessage: string) => {
    setError(errorMessage);
  };

  const changeTitle = (newTitle: string) => {
    setTitle(newTitle);
  };

  const addTodo = useCallback((todoTitle: string) => {
    setIsFetching(true);

    const newTodo = {
      userId: USER_ID,
      title: todoTitle,
      completed: false,
    };

    setTempTodo({
      id: 0,
      ...newTodo,
    });

    postTodo(newTodo)
      .then((todoFromResponse) => {
        setTodos([
          ...todos,
          todoFromResponse,
        ]);
      })
      .catch(() => {
        setError('Unable to add a todo');
      })
      .finally(() => {
        setIsFetching(false);
        setTempTodo(null);
        setTitle('');
      });
  }, [todos]);

  const removeTodo = useCallback((todoId: number) => {
    setLoadingTodoIds((currentTodoIds) => [
      ...currentTodoIds,
      todoId,
    ]);

    deleteTodo(todoId)
      .then(() => {
        setTodos((currentTodos) => (
          currentTodos.filter((todo) => todo.id !== todoId)
        ));
      })
      .catch(() => setError('Unable to delete a todo'))
      .finally(() => {
        setLoadingTodoIds((currentIds) => (
          currentIds.filter((id) => id !== todoId)
        ));
      });
  }, [todos]);

  const clearCompletedTodos = useCallback(() => {
    completedTodos.forEach(async (todo) => {
      removeTodo(todo.id);
    });
  }, [completedTodos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          hasSomeActiveTodos={hasSomeActiveTodos}
          onAddTodo={addTodo}
          onChangeNotification={changeNotification}
          isLoading={isLoading}
          title={title}
          onChangeTitle={changeTitle}
        />

        {areTodosVisible && (
          <>
            <TodoList
              tempTodo={tempTodo}
              todos={visibleTodos}
              onRemoveTodo={removeTodo}
              loadingtodoIds={loadingTodoIds}
            />

            <Footer
              hasSomeCompletedTodos={hasSomeCompletedTodos}
              count={todosCount}
              statusFilter={statusFilter}
              onFilter={changeFilterStatus}
              onClearCompletedTodos={clearCompletedTodos}
            />
          </>
        )}
      </div>

      {error && (
        <Notification
          error={error}
          onCloseNotifications={closeNotifications}
        />
      )}
    </div>
  );
};
