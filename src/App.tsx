import React, { useEffect, useMemo, useState } from 'react';

import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import { Error } from './components/Error/Error';

import { UserWarning } from './UserWarning';

import { Todo } from './types/Todo';
import { Filter } from './enums/Filter';
import { deleteTodo, getTodos, postTodos } from './api/todos';
import { ErrorMessage } from './enums/ErrorMessages';
import { TodoList } from './components/TodoList/TodoList';

const USER_ID = 10319;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<null | Todo>(null);
  const [filterValue, setFilterValue] = useState(Filter.All);
  const [error, setError] = useState(ErrorMessage.NONE);
  const [loadingTodo, setLoadingTodo] = useState([0]);
  const [isInputDisabled, setIsInputDisabled] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getTodos(USER_ID);
        const todosData = response as Todo[];

        setTodos(todosData);
      } catch (err) {
        setError(ErrorMessage.LOAD);
      }
    };

    fetchData();
  }, []);

  const addNewTodo = async (title: string) => {
    try {
      const todo = {
        title,
        userId: USER_ID,
        completed: false,
      };

      const newTodo = await postTodos(todo);

      setTempTodo({
        id: 0,
        ...todo,
      });

      setTodos(current => [...current, newTodo]);
      setIsInputDisabled(true);
    } catch (err) {
      setError(ErrorMessage.ADD);
    } finally {
      setIsInputDisabled(false);
      setTempTodo(null);
    }
  };

  const removeTodo = async (id: number) => {
    try {
      setLoadingTodo(prev => [...prev, id]);
      await deleteTodo(id);
      setTodos(current => current.filter(todo => todo.id !== id));
    } catch (err) {
      setError(ErrorMessage.DELETE);
    } finally {
      setTempTodo(null);
      setLoadingTodo([0]);
    }
  };

  const selectAll = () => {
    setFilterValue(Filter.All);
  };

  const selectCompleted = () => {
    setFilterValue(Filter.Completed);
  };

  const selectActive = () => {
    setFilterValue(Filter.Active);
  };

  const clearCompleted = () => {
    todos.forEach(async (todo) => {
      if (todo.completed) {
        await removeTodo(todo.id);
      }
    });
  };

  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (filterValue) {
        case Filter.Active:
          return !todo.completed;
        case Filter.Completed:
          return todo.completed;
        default:
          return todo;
      }
    });
  }, [todos, filterValue]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={filteredTodos}
          onAdd={addNewTodo}
          onAddError={setError}
          isDisabled={isInputDisabled}
        />

        <TodoList
          todos={filteredTodos}
          tempTodo={tempTodo}
          onDelete={removeTodo}
          loadingTodo={loadingTodo}
        />

        {filteredTodos && (
          <Footer
            todos={filteredTodos}
            filterValue={filterValue}
            onActive={selectActive}
            onAll={selectAll}
            onCompleted={selectCompleted}
            clearCompleted={clearCompleted}
          />
        )}
      </div>

      {error && (
        <Error
          error={error}
          closeError={() => setError(ErrorMessage.NONE)}
        />
      )}
    </div>
  );
};
