import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, postTodo, deleteTodo, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer';
import { Header } from './components/Header/Header';
// eslint-disable-next-line max-len
import { ErrorNotification } from './components/ErrorNotification/ErrorNotification';
import { TodoFilterOptions } from './types/TodoFiltersOptions';

export const App: React.FC = () => {
  //#region State Management
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [error, setError] = useState<string>('');
  const [todoFilterValue, setTodoFilterValue] = useState<TodoFilterOptions>(
    TodoFilterOptions.All,
  );
  //#endregion

  //#region Fetch Todos
  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setError('Unable to load todos'));
  }, []);
  //#endregion

  //#region Filters
  const filterTodos = useCallback(
    (todosForFilter: Todo[], statusFilterValue: TodoFilterOptions) => {
      return todosForFilter.filter(todo => {
        switch (statusFilterValue) {
          case TodoFilterOptions.Active:
            return !todo.completed;
          case TodoFilterOptions.Completed:
            return todo.completed;
          default:
            return true;
        }
      });
    },
    [],
  );

  const filteredTodos = useMemo(
    () => filterTodos(todos, todoFilterValue),
    [filterTodos, todos, todoFilterValue],
  );

  const uncompletedTodos = useMemo(() => {
    const uncompletedTodosArr = todos.filter(todo => !todo.completed);

    return uncompletedTodosArr;
  }, [todos]);

  const completedTodos = useMemo(() => {
    return todos.filter(todo => todo.completed);
  }, [todos]);
  //#endregion

  //#region Add Todo
  const addTodo = useCallback(async (title: string) => {
    const newTodoTitle = title.trim();

    if (!newTodoTitle) {
      setError('Title should not be empty');

      return;
    }

    const newTodo = {
      userId: USER_ID,
      title: newTodoTitle,
      completed: false,
    };

    setTempTodo({ id: 0, ...newTodo });

    try {
      const response = await postTodo(newTodo);

      setTodos(prevTodos => [...prevTodos, response]);
      setError('');
    } catch (err) {
      setError('Unable to add a todo');
      throw err;
    } finally {
      setTempTodo(null);
    }
  }, []);
  //#endregion

  //#region Remove Todo
  const removeTodo = useCallback((todoId: Pick<Todo, 'id'> | number) => {
    return deleteTodo(todoId)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
        setError('');
      })
      .catch(err => {
        setError('Unable to delete a todo');

        return Promise.reject(err);
      });
  }, []);
  //#endregion

  //#region Clear Completed Todos
  const clearCompletedTodos = useCallback(() => {
    if (completedTodos.length === 0) {
      return;
    }

    Promise.allSettled(completedTodos.map(todo => removeTodo(todo.id)))
      .then(results => {
        const hasError = results.some(result => result.status === 'rejected');

        if (hasError) {
          setError('Some todos could not be deleted');
        } else {
          setError('');
        }
      })
      .catch(() => {
        setError('Unable to delete todos');
      });
  }, [completedTodos, removeTodo]);
  //#endregion

  //#region JSX Return
  return (
    <>
      {USER_ID ? (
        <div className="todoapp">
          <h1 className="todoapp__title">todos</h1>

          <div className="todoapp__content">
            <Header
              addTodo={addTodo}
              areAllTodosCompleted={uncompletedTodos.length === 0}
            />

            {(!!todos.length || tempTodo) && (
              <>
                <TodoList
                  todos={filteredTodos}
                  tempTodo={tempTodo}
                  deleteTodo={removeTodo}
                />
                <Footer
                  activeTodoFilter={todoFilterValue}
                  setTodoFilterValue={setTodoFilterValue}
                  uncompletedTodosCount={uncompletedTodos.length}
                  completedTodosCount={completedTodos.length}
                  clearCompletedTodos={clearCompletedTodos}
                />
              </>
            )}
          </div>

          <ErrorNotification errorMessage={error} setErrorMessage={setError} />
        </div>
      ) : (
        <UserWarning />
      )}
    </>
  );
  //#endregion
};
