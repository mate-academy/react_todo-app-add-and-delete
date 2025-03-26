import React, { useEffect, useState, useMemo } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import * as apiMethods from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import { TodoList } from './components/TodoList/TodoList';
// eslint-disable-next-line
import { ErrorNotification } from './components/ErrorNotification/ErrorNotification';
import FilteredTodo from './types/FilteredTodo';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [filtered, setFiltered] = useState<FilteredTodo>(FilteredTodo.All);
  const [adding, setAdding] = useState(false);
  const [deletedTodo, setDeletedTodo] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  useEffect(() => {
    const loadTodos = () => {
      setIsLoading(true);
      setErrorMessage(null);

      apiMethods
        .getTodos()
        .then(data => {
          setTodos(data);
        })
        .catch(() => {
          setErrorMessage('Unable to load todos');
        })
        .finally(() => {
          setIsLoading(false);
        });
    };

    loadTodos();
  }, []);

  const visibleTodos = useMemo(() => {
    switch (filtered) {
      case FilteredTodo.Active:
        return todos.filter(td => !td.completed);
      case FilteredTodo.Completed:
        return todos.filter(td => td.completed);
      default:
        return todos;
    }
  }, [filtered, todos]);

  const uncompletedTodos = useMemo(() => {
    return todos.filter(td => !td.completed).length;
  }, [todos]);

  const changeVisibleTodos = (filterType: FilteredTodo) => {
    setFiltered(filterType);
  };

  async function addTodo(title: string) {
    setAdding(true);
    setErrorMessage('');
    setTempTodo({ id: 0, title, completed: false, userId: apiMethods.USER_ID });

    try {
      if (title.trim().length === 0) {
        setErrorMessage('Title should not be empty');
        setAdding(false);

        return;
      }

      const newTodo = await apiMethods.addTodo({
        title,
        completed: false,
        userId: apiMethods.USER_ID,
      });

      setTodos(prevTodos => {
        return [...prevTodos, newTodo];
      });
    } catch {
      setErrorMessage('Unable to add a todo');
    } finally {
      setAdding(false);
      setTempTodo(null);
    }
  }

  async function deleteTodo(todosId: number[]) {
    setDeletedTodo(todosId);

    await Promise.all(
      todosId.map(async todoId => {
        try {
          await apiMethods.deleteTodo(todoId);
          setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
        } catch {
          setErrorMessage('Unable to delete a todo');
        }
      }),
    );

    setDeletedTodo([]);
  }

  if (!USER_ID) {
    return <UserWarning />;
  }

  const changeError = (error: string) => {
    setErrorMessage(error);
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          errorMessage={errorMessage}
          todos={todos}
          adding={adding}
          onAdd={addTodo}
        />

        {!isLoading && (
          <TodoList
            todos={visibleTodos}
            onDelete={deleteTodo}
            deletedTodo={deletedTodo}
            tempTodo={tempTodo}
            adding={adding}
          />
        )}

        {todos.length > 0 && (
          <Footer
            changeVisibleTodos={changeVisibleTodos}
            filtered={filtered}
            onDelete={deleteTodo}
            uncompletedTodos={uncompletedTodos}
            todos={todos}
          />
        )}
      </div>
      <ErrorNotification
        errorMessage={errorMessage}
        changeError={changeError}
      />
    </div>
  );
};
