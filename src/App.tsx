import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import './styles/transitions.scss';
import { UserWarning } from './components/UserWarning.tsx/UserWarning';
import {
  createTodo, deleteTodo,
  getTodos, patchTodo,
} from './api/todos';
// types
import { Todo } from './types/Todo';
import { Filters } from './types/Filters';
import { ErrorMessages } from './types/ErrorMessages';
// components
import { TodosHeader } from './components/TodosHeader/TodosHeader';
import { TodoFooter } from './components/TodoFooter/TodoFooter';
import { TodoList } from './components/TodoList/TodoList';
import { NotificationModal } from './components/Notification/Notification';

const USER_ID = 11208;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loadingTodoId, setLoadingTodoId] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [filter, setFilter] = useState<Filters>('all');
  const [error, setError] = useState<string | null>(null);

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case 'active':
        return todos.filter(todo => !todo.completed);

      case 'completed':
        return todos.filter(todo => todo.completed);

      case 'all':
      default:
        return todos;
    }
  }, [filter, todos]);

  const nrOfActiveTodos = useMemo(() => {
    return todos.filter(todo => !todo.completed).length;
  }, [todos]);

  const completedTodosId = useMemo(() => {
    return todos.filter(
      todo => todo.completed,
    ).reduce<number[]>((acc, next) => {
      return [...acc, next.id];
    }, []);
  }, [todos]);

  const changeErrorMessage = (message: string) => {
    setError(message);
    setTimeout(() => {
      setError('');
    }, 3000);
  };

  const addTodo = (todo: string) => {
    const newTodo = {
      id: 0,
      title: todo,
      userId: USER_ID,
      completed: false,
    };

    setTempTodo(newTodo);

    createTodo(newTodo)
      .then(data => {
        setTodos(old => old.concat(data));
      })
      .catch(() => changeErrorMessage(ErrorMessages.ADD))
      .finally(() => {
        setTempTodo(null);
      });
  };

  const removeTodo = useCallback((itemId: number) => {
    setLoadingTodoId(prev => [...prev, itemId]);
    deleteTodo(itemId)
      .then(() => setTodos(old => old.filter(todo => todo.id !== itemId)))
      .catch(() => changeErrorMessage(ErrorMessages.DELETE))
      .finally(
        () => setLoadingTodoId(prev => prev.filter(id => id !== itemId)),
      );
  }, []);

  const updateTodo = (itemId: number, completed: boolean) => {
    setLoadingTodoId(prev => [...prev, itemId]);
    patchTodo(itemId, !completed)
      .then(() => setTodos(old => old.map(todo => {
        if (todo.id === itemId) {
          return {
            ...todo,
            completed: !completed,
          };
        }

        return todo;
      })))
      .catch(() => changeErrorMessage(ErrorMessages.UPDATE))
      .finally(
        () => setLoadingTodoId(prev => prev.filter(id => id !== itemId)),
      );
  };

  const removeAllCompleted = useCallback(() => {
    todos.forEach(todo => {
      if (todo.completed) {
        removeTodo(todo.id);
      }
    });
  }, [todos, removeTodo]);

  useEffect(() => {
    getTodos(USER_ID)
      .then(data => setTodos(data))
      .catch(() => changeErrorMessage(ErrorMessages.DOWNLOAD));
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodosHeader
          todos={todos}
          addTodo={addTodo}
          changeErrorMessage={changeErrorMessage}
        />

        <section className="todoapp__main">
          <TodoList
            todos={filteredTodos}
            tempTodo={tempTodo}
            loadingTodoId={loadingTodoId}
            removeTodo={removeTodo}
            updateTodo={updateTodo}
          />
        </section>

        {todos.length > 0 && (
          <TodoFooter
            filter={filter}
            setFilter={setFilter}
            nrOfActiveTodos={nrOfActiveTodos}
            completedTodosId={completedTodosId}
            clearAll={removeAllCompleted}
          />
        )}
      </div>

      <NotificationModal error={error} clearError={() => setError(null)} />
    </div>
  );
};
