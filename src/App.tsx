import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  createTodo,
  getTodos,
  deleteTodo,
  USER_ID,
} from './api/todos';

import { Errors } from './types/Errors';
import { Filters } from './types/Filters';
import { TodoType } from './types/TodoType';

import Header from './Components/Header/Header';
import Footer from './Components/Footer/Footer';
import TodoList from './Components/TodoList/TodoList';
import Notification from './Components/Notification/Notification';

import { filterTodos } from './utils/filterTodos';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<TodoType[]>([]);
  const [filter, setFilter] = useState(Filters.All);
  const [errorMessage, setErrorMessage] = useState<Errors | null>(null);
  const [tempTodo, setTempTodo] = useState<TodoType | null>(null);
  const [isActiveDelComTodo, setActiveDelComTodo] = useState(false);

  const fetchingTodos = async () => {
    try {
      const response = await getTodos(USER_ID);

      setTodos(response);
    } catch (error) {
      setErrorMessage(Errors.UPLOAD);
    }
  };

  useEffect(() => {
    fetchingTodos();
  }, []);

  const todosLength = useMemo(() => todos.length, [todos]);

  const completedTodos = useMemo(() => {
    return filterTodos(Filters.COMPLETED, todos);
  }, [todos]);

  const addNewTodo = async (value: string) => {
    if (!value.length) {
      setErrorMessage(Errors.EMPTY);

      return;
    }

    const newTodo = {
      userId: USER_ID,
      title: value,
      completed: false,
    };

    setTempTodo({ ...newTodo, id: 0 });
    try {
      const response = await createTodo(newTodo);

      setTodos(currentTodos => [...currentTodos, response]);
    } catch (error) {
      setErrorMessage(Errors.ADD);
    } finally {
      setTempTodo(null);
    }
  };

  const removeTodo = async (id: number): Promise<void> => {
    try {
      await deleteTodo(id);

      setTodos(currentTodos => currentTodos
        .filter(currTodo => currTodo.id !== id));
    } catch (error) {
      setErrorMessage(Errors.DEL);
    }
  };

  const removeAllCompletedTodo = async () => {
    const completedTodosId = completedTodos
      .map(todo => removeTodo(todo.id));

    setActiveDelComTodo(true);

    Promise.all([...completedTodosId])
      .then(() => {
        setTodos(todos.filter(todo => !todo.completed));
      }).finally(() => setActiveDelComTodo(false));
  };

  const visibleTodos = useMemo(() => (
    filterTodos(filter, todos)
  ), [todos, filter]);

  const changeFilter = (value: Filters) => {
    if (value === filter) {
      return;
    }

    setFilter(value);
  };

  const closeError = () => {
    setErrorMessage(null);
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          completedTodosLength={completedTodos.length}
          todosLength={todosLength}
          addNewTodo={addNewTodo}
        />

        <section className="todoapp__main">
          <TodoList
            visibleTodos={visibleTodos}
            tempTodo={tempTodo}
            removeTodo={removeTodo}
            isActiveDelComTodo={isActiveDelComTodo}
          />
        </section>

        {!!todos.length && (
          <Footer
            filter={filter}
            changeFilter={changeFilter}
            completedTodosLength={completedTodos.length}
            todosLength={todosLength}
            removeAllCompletedTodo={removeAllCompletedTodo}
          />
        )}
      </div>

      <Notification
        errorMessage={errorMessage}
        closeError={closeError}
      />
    </div>
  );
};
