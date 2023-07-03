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
  const [filterStatus, setFilterStatus] = useState(FilterStatus.all);
  const [error, setError] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [title, setTitle] = useState('');
  const [loadingTodoIds, setLoadingTodoIds] = useState([0]);

  useEffect(() => {
    getTodos()
      .then(todosFromServer => setTodos(todosFromServer))
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
  const isTodosVisible = todosCount > 0;

  const visibleTodos = useMemo(() => {
    return getFilteredTodos(todos, filterStatus);
  }, [todos, filterStatus]);

  const completedTodos = useMemo(() => {
    return todos.filter((todo) => todo.completed);
  }, [todos, filterStatus]);

  const isSomeActiveTodos = todosCount - completedTodos.length > 0;
  const isSomeCompletedTodos = completedTodos.length > 0;

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
      completed: true,
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
          isSomeActiveTodos={isSomeActiveTodos}
          onAddTodo={addTodo}
          onChangeNotification={changeNotification}
          isFetching={isFetching}
          title={title}
          onChangeTitle={changeTitle}
        />

        {isTodosVisible && (
          <>
            <TodoList
              tempTodo={tempTodo}
              todos={visibleTodos}
              onRemoveTodo={removeTodo}
              loadingtodoIds={loadingTodoIds}
            />

            <Footer
              isSomeCompletedTodos={isSomeCompletedTodos}
              count={todosCount}
              filterStatus={filterStatus}
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
