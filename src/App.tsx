import React, { useEffect, useMemo, useState } from 'react';
import { Todo } from './types/Todo';
import { addTodo, deleteTodo, getTodos } from './api/todos';
import { TodoFilter } from './components/TodoFilter';
import { TodoList } from './components/TodoList';
import { Header } from './components/Header';
import { Errors } from './types/Errors';
import { Filters } from './types/Filters';

const USER_ID = 11558;

const ErrorNotification: React.FC<{ errorMesssage: string,
  setErrorMesssage: (val: string) => void }> = ({
  errorMesssage,
  setErrorMesssage,
}) => {
  if (errorMesssage) {
    setTimeout(() => setErrorMesssage(''), 3000);
  }

  return (
    <div
      data-cy="ErrorNotification"
      className={`notification is-danger is-light has-text-weight-normal ${errorMesssage.length === 0 ? 'hidden' : ''}`}
    >
      <button
        aria-label="error"
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorMesssage('')}
      />
      {errorMesssage}
    </div>
  );
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMesssage, setErrorMesssage] = useState<string>('');
  const [filter, setFilter] = useState<Filters>(Filters.All);
  const [title, setTitle] = useState<string>('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isDisable, setIsDisable] = useState<boolean>(false);
  const [loadingItems, setLoadingItems] = useState<number[]>([]);

  useEffect(() => {
    getTodos(USER_ID).then(setTodos)
      .catch(() => setErrorMesssage(Errors.load));
  }, []);

  const filteredTodos = useMemo(() => [...todos].filter(({ completed }) => {
    if (filter === Filters.All) {
      return true;
    }

    return (filter === Filters.Active)
      ? !completed
      : completed;
  }), [todos, filter]);

  const removeTodo = (todoId: number) => {
    setLoadingItems(current => [...current, todoId]);

    deleteTodo(todoId)
      .then(() => setTodos(current => current
        .filter(todo => todo.id !== todoId)))
      .catch(() => setErrorMesssage(Errors.delete))
      .finally(() => setLoadingItems(current => current
        .filter((id:number) => id !== todoId)));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      return setErrorMesssage(Errors.title);
    }

    const newTodo = {
      id: 0,
      userId: USER_ID,
      title: title.trim(),
      completed: false,
    };

    setTempTodo(newTodo);

    setIsDisable(true);

    return addTodo(newTodo)
      .then((resultTodo:Todo) => {
        setTodos(current => [...current, resultTodo]);
        setTitle('');
      })
      .catch(() => setErrorMesssage(Errors.add))
      .finally(() => {
        setIsDisable(false);
        setTempTodo(null);
      });
  };

  const clearCompletedTodos = () => todos.filter(({ completed }) => completed)
    .forEach(todo => removeTodo(todo.id));

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          isDisable={isDisable}
          onHandleSubmit={handleSubmit}
          title={title}
          setTitle={setTitle}
          todos={todos}
        />

        {filteredTodos.length > 0 && (
          <TodoList
            todos={filteredTodos}
            tempTodo={tempTodo}
            removeTodo={removeTodo}
            loadingItems={loadingItems}
          />
        )}

        {todos.length > 0 && (
          <TodoFilter
            todos={todos}
            clearCompletedTodos={clearCompletedTodos}
            selectedFilter={filter}
            onSelectedFilter={setFilter}
          />
        )}

      </div>

      <ErrorNotification
        errorMesssage={errorMesssage}
        setErrorMesssage={setErrorMesssage}
      />
    </div>
  );
};
