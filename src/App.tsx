import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import * as todoService from './api/todos';
import { Todo } from './types/Todo';
import { TodoFooter } from './Components/Footer';
import { TodoHeader } from './Components/Header';
import { TodoMain } from './Components/Main';
import { ErrorNotifications } from './Components/Errors';
import { Filter } from './types/Filter';
import { Errors } from './types/Errors';
import { filterTodos } from './Components/FilterFunc/FilterTodos';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState(Filter.All);
  const [errorMessage, setErrorMessage] = useState<Errors | null>(null);
  const [processing, setProcessing] = useState(-1);
  const [todosQuantity, setTodosQuantity] = useState(0);

  const AddTodo = useCallback(
    (newTodo: Todo) => {
      setErrorMessage(null);
      setProcessing(0);
      setTodos(currentTodos => [...currentTodos, newTodo]);

      return todoService
        .createTodo(newTodo)
        .then(todo => setTodos(currentTodos => [...currentTodos, todo]))
        .then(() =>
          setTodos(currentTodos => {
            currentTodos.splice(currentTodos.length - 2, 1);

            if (!newTodo.completed) {
              setTodosQuantity(todosQuantity + 1);
            }

            return currentTodos;
          }),
        )
        .catch(error => {
          setErrorMessage(Errors.Add);
          setTodos(currentTodos => {
            currentTodos.splice(currentTodos.length - 1, 1);

            return currentTodos;
          });
          throw error;
        })
        .finally(() => setProcessing(-1));
    },
    [todosQuantity],
  );

  const DeleteTodo = useCallback(
    (todoId: number) => {
      setErrorMessage(null);
      setProcessing(todoId);

      return todoService
        .deleteTodo(todoId)
        .then(() =>
          setTodos(currentTodos => {
            const foundedTodo = currentTodos.find(todo => todoId === todo.id);

            if (!foundedTodo?.completed) {
              setTodosQuantity(todosQuantity - 1);
            }

            return currentTodos.filter(todo => todo.id !== todoId);
          }),
        )
        .catch(error => {
          setErrorMessage(Errors.Delete);
          throw error;
        })
        .finally(() => setProcessing(-1));
    },
    [todosQuantity],
  );

  const viewedTodos = useMemo(
    () => filterTodos(todos, filter),
    [todos, filter],
  );

  useEffect(() => {
    setErrorMessage(null);

    todoService
      .getTodos()
      .then(todosFromServer => {
        setTodos(todosFromServer);
        setTodosQuantity(
          todosFromServer.filter(todo => !todo.completed).length,
        );
      })
      .catch(error => {
        setErrorMessage(Errors.Upload);
        throw error;
      });
  }, []);

  if (!todoService.USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          todos={todos}
          onAdd={AddTodo}
          setError={setErrorMessage}
          processing={processing}
        />

        <section className="todoapp__main" data-cy="TodoList">
          {viewedTodos.map(todo => (
            <TodoMain
              todo={todo}
              onDelete={DeleteTodo}
              processing={processing}
              key={todo.id}
            />
          ))}
        </section>

        {!!todos.length && (
          <TodoFooter
            todosQuantity={todosQuantity}
            filter={filter}
            setFilter={setFilter}
            todos={todos}
            onDelete={DeleteTodo}
          />
        )}
      </div>

      <ErrorNotifications error={errorMessage} setError={setErrorMessage} />
    </div>
  );
};
