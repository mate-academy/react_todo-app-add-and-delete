/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState, useMemo } from 'react';
import * as todoService from './api/todos';
import { Todo } from './types/Todo';
import { ErrorType } from './types/ErrorType';
import { FilterTodos } from './utils/FilterTodos';
import { TodoList } from './components/TodoList/TodoList';
import { TodoHeader } from './components/TodoHeader/TodoHeader';
import { TodoFooter } from './components/TodoFooter/TodoFooter';
import { Error } from './components/Error/Error';

const USER_ID = 11857;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todosError, setTodosError] = useState(ErrorType.DEFAULT);
  const [filteredTodos, setfilteredTodos] = useState(FilterTodos.ALL);
  const [hiddenClass, setHiddenClass] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  useEffect(() => {
    todoService.getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setTodosError(ErrorType.UNABLED_LOAD_TODOS);
        setHiddenClass(false);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const addTodo = (
    title: string,
    setTitle: (value: string) => void,
  ) => {
    const newTodo = {
      userId: USER_ID,
      title: title.trim(),
      completed: false,
    };

    setTempTodo({
      id: 0,
      ...newTodo,
    });

    setIsLoading(true);

    todoService.addTodo(newTodo)
      .then((data) => {
        setTodos(prevTodos => [...prevTodos, data] as Todo[]);
        setTitle('');
      })
      .catch(() => {
        setHiddenClass(false);
        setTodosError(ErrorType.UNABLE_ADD_TODO);
      })
      .finally(() => {
        setTempTodo(null);
        setIsLoading(false);
        setTitle('');
      });
  };

  const deleteTodo = (id: number) => {
    todoService.deleteTodo(id)
      .then(() => {
        setTodos(prev => prev.filter(todo => todo.id !== id));
      })
      .catch(() => {
        setHiddenClass(false);
        setTodosError(ErrorType.UNABLE_DELETE_TODO);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const visibleTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (filteredTodos) {
        case FilterTodos.ACTIVE:
          return !todo.completed;
          break;

        case FilterTodos.COMPLETED:
          return todo.completed;
          break;

        default:
          return true;
      }
    });
  }, [todos, filteredTodos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          onSetTodosError={setTodosError}
          onSetHiddenClass={setHiddenClass}
          onSubmitForm={addTodo}
        />

        <TodoList
          todos={visibleTodos}
          onDelete={deleteTodo}
          tempTodo={tempTodo}
        />

        {/* Hide the footer if there are no todos */}
        {todos.length !== 0 && (
          <TodoFooter
            todos={todos}
            filteredTodos={filteredTodos}
            setfilteredTodos={setfilteredTodos}
          />
        )}
      </div>

      {todosError && !isLoading && (
        <Error
          hiddenClass={hiddenClass}
          todosError={todosError}
          onSetHiddenClass={setHiddenClass}
        />
      )}
    </div>
  );
};
