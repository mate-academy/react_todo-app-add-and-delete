import React, { useEffect, useState } from 'react';
import { Header } from './components/header';
import { Main } from './components/main';
import { Footer } from './components/footer';
import { ErrorNotification } from './components/error';

import { TodoFilter } from './types/filter';
import { Todo } from './types/Todo';
import { Error } from './types/errors';

import { getTodos } from './api/todos';
import { handleFilter } from './utils/filterFunction';
import { TodoServiceApi } from './utils/todoService';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [sortFilter, setSortFilter] = useState<TodoFilter>(TodoFilter.All);
  const [onError, setOnError] = useState('');
  const [loading, setLoading] = useState([0]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const areTodosActive =
    todos.every(todo => todo.completed) && todos.length > 0;
  const prepared = handleFilter(todos, sortFilter);
  const activeCounter = todos.filter(todo => !todo.completed).length;
  const notActiveCounter = todos.filter(todo => todo.completed).length;

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setOnError(Error.GET));

    setTimeout(() => {
      setOnError('');
    }, 3000);
  }, []);

  const handleDelete = (id: number) => {
    setLoading(prevTodo => [...prevTodo, id]);

    TodoServiceApi.deleteTodo(id)
      .then(() => setTodos(prevTodo => prevTodo.filter(elem => elem.id !== id)))
      .catch(() => setOnError(Error.DELETE))
      .finally(() => {
        setLoading(prevTodo => prevTodo.filter(todoId => todoId !== id));
      });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          areTodosActive={areTodosActive}
          setErrorMessage={setOnError}
          todos={todos}
          setTodos={setTodos}
          setTempTodo={setTempTodo}
        />
        <Main
          todos={prepared}
          handleDelete={handleDelete}
          loading={loading}
          tempTodo={tempTodo}
        />

        {!!todos.length && (
          <Footer
            sortFilter={sortFilter}
            setSortFilter={setSortFilter}
            activeCounter={activeCounter}
            notActiveCounter={notActiveCounter}
            todos={todos}
            handleDelete={handleDelete}
          />
        )}
      </div>

      <ErrorNotification errorMessage={onError} setErrorMessage={setOnError} />
    </div>
  );
};
