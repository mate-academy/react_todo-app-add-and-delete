/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { addTodo, deleteTodo, getTodos } from './api/todos';
import { FilterType } from './types/FilterType';
import { ErrorNotification } from './components/ErrorNotification';
import { Header } from './components/Header';
import { Main } from './components/Main';
import { Footer } from './components/Footer';
import { FilterContext } from './contexts/FilterContext';
import { TodosContext } from './contexts/TodosContext';
import { USER_ID } from './constans';

const getFilteredTodos = (todos: Todo[], filterType: FilterType) => {
  return todos.filter(todo => {
    switch (filterType) {
      case FilterType.All:
        return todo;

      case FilterType.Active:
        return !todo.completed;

      case FilterType.Completed:
        return todo.completed;

      default: throw new Error('Wrong filter type!');
    }
  });
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterType, setFilterType] = useState(FilterType.All);
  const [errorNotification, setErrorNotification] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [
    waitingForResponseTodosId,
    setWaitingForResponseTodosId,
  ] = useState<number[]>([]);

  const filteredTodos: Todo[] = useMemo(() => (
    getFilteredTodos(todos, filterType)), [todos, filterType]);

  const activeTodosCount = useMemo(() => (
    todos.filter(todo => !todo.completed).length), [todos]);

  const loadTodos = useCallback(async () => {
    setErrorNotification('');
    try {
      const todosFromServer = await getTodos(USER_ID);

      setTodos(todosFromServer);
    } catch {
      setErrorNotification('Error on loading');
    }
  }, []);

  const createTodo = useCallback(async (todoTitle: string) => {
    if (!todoTitle) {
      setErrorNotification('Title can`t be empty');

      return;
    }

    setErrorNotification('');

    try {
      const newTodo = {
        title: todoTitle,
        userId: USER_ID,
        completed: false,
      };

      await addTodo(USER_ID, newTodo);

      setTempTodo({ ...newTodo, id: 0 });

      await loadTodos();
    } catch {
      setErrorNotification('Unable to add a todo');
    } finally {
      setTempTodo(null);
    }
  }, []);

  const removeTodos = useCallback(async (todosId: number[]) => {
    setErrorNotification('');
    console.log(todosId);
    try {
      setWaitingForResponseTodosId(
        [...waitingForResponseTodosId, ...todosId],
      );
      console.log(waitingForResponseTodosId);

      await Promise.all(
        todosId.map(async (id) => {
          await deleteTodo(id);
        }),
      );

      await loadTodos();
    } catch {
      setErrorNotification('Unable to delete a todo');
    } finally {
      setWaitingForResponseTodosId([]);
    }
  }, []);

  useEffect(() => {
    loadTodos();
  }, [filterType]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header todosCount={filteredTodos.length} addTodo={createTodo} />

        {!!filteredTodos.length && (
          <>
            <TodosContext.Provider value={{
              todos: filteredTodos,
              waitingForResponseTodosId,
              removeTodo: removeTodos,
            }}
            >
              <Main tempTodo={tempTodo} />

              <FilterContext.Provider value={{
                filter: filterType,
                setFilter: setFilterType,
              }}
              >
                <Footer
                  todosCount={filteredTodos.length}
                  activeTodosCount={activeTodosCount}
                />
              </FilterContext.Provider>
            </TodosContext.Provider>
          </>
        )}

      </div>

      {errorNotification && (
        <ErrorNotification errorNotification={errorNotification} />
      )}
    </div>
  );
};
