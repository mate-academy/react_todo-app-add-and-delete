import React, { useEffect, useMemo, useState } from 'react';
import { Todo } from './types/Todo';
import { addTodo, deleteTodo, getTodos } from './api/todos';
import { ErrorNotification } from './Components/ErrorNotification';
import { TodoFilter } from './Components/TodoFilter';
import { TodoList } from './Components/TodoList';
import { TodoHeader } from './Components/TodoHeader';
import { UserWarning } from './Components/UserWarning';
import { ErrorMessage } from './types/ErrorMessage';
import { FilterTypes } from './types/FilterTypes';

const USER_ID = 11558;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMesssage, setErrorMesssage] = useState<string>('');
  const [filter, setFilter] = useState<FilterTypes>(FilterTypes.All);
  const [title, setTitle] = useState<string>('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isDisable, setIsDisable] = useState<boolean>(false);
  const [loadingItems, setLoadingItems] = useState<number[]>([]);

  useEffect(() => {
    getTodos(USER_ID).then(setTodos)
      .catch(() => setErrorMesssage(ErrorMessage.load));
  }, []);

  const filteredTodos = useMemo(() => [...todos].filter(({ completed }) => {
    if (filter === FilterTypes.All) {
      return true;
    }

    return (filter === FilterTypes.Active)
      ? !completed
      : completed;
  }), [todos, filter]);

  const removeTodo = (todoId: number) => {
    setLoadingItems(current => [...current, todoId]);

    deleteTodo(todoId)
      .then(() => setTodos(current => current
        .filter(todo => todo.id !== todoId)))
      .catch(() => setErrorMesssage(ErrorMessage.delete))
      .finally(() => setLoadingItems(current => current
        .filter((id:number) => id !== todoId)));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      return setErrorMesssage(ErrorMessage.title);
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
      .catch(() => setErrorMesssage(ErrorMessage.add))
      .finally(() => {
        setIsDisable(false);
        setTempTodo(null);
      });
  };

  const clearCompletedTodos = () => todos.filter(({ completed }) => completed)
    .forEach(todo => removeTodo(todo.id));

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
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
