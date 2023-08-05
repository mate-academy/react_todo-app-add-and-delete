/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { TodoHeader } from './components/TodoHeader';
import { client } from './utils/fetchClient';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';
import { Notification } from './components/Notification';
import { FilterBy } from './types/FilterBy';
import { Errors } from './types/Errors';

const USER_ID = 11246;
const BASE_ADD_URL = '/todos';
const URL_GET = `?userId=${USER_ID}`;
const DELAY_ERROR = 3000;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [hasTodoLoaderIds, setHasTodoLoaderIds] = useState<number[]>([]);
  const [filterBy, setFilterBy] = useState<FilterBy>(FilterBy.all);
  const [error, setError] = useState<Errors | null>(null);

  const applyFilter = (filter: FilterBy) => {
    setFilterBy(filter);
  };

  const addTodo = async (title: string) => {
    if (title) {
      const newTodo = {
        title,
        userId: USER_ID,
        completed: false,
      };

      setHasTodoLoaderIds([0]);
      setTempTodo({
        ...newTodo,
        id: 0,
      });

      try {
        const addedTodo = await client.post<Todo>(BASE_ADD_URL, newTodo);

        setTodos(currentTodos => [
          ...currentTodos,
          addedTodo,
        ]);
      } catch (caughtError) {
        setError(Errors.add);
        throw caughtError;
      } finally {
        setTempTodo(null);
        setHasTodoLoaderIds([]);
      }
    } else {
      setError(Errors.emptyTitle);
    }
  };

  const deleteTodo = async (id: number) => {
    setHasTodoLoaderIds(currentIds => [...currentIds, id]);
    try {
      await client.delete(`${BASE_ADD_URL}/${id}`);
      setTodos(currentTodos => {
        return [...currentTodos].filter(todo => todo.id !== id);
      });
    } catch (errorCought) {
      if (!error) {
        setError(Errors.delete);
      }
    } finally {
      setHasTodoLoaderIds(currentIds => [...currentIds].filter(
        hasLoaderId => hasLoaderId !== id,
      ));
    }
  };

  const clearCompleted = () => {
    const completedTodos
      = todos.filter(todo => todo.completed).map(todo => todo.id);

    completedTodos.forEach(completedTodo => deleteTodo(completedTodo));
  };

  const todosToRender = todos.filter(todo => {
    switch (filterBy) {
      case FilterBy.active:
        return !todo.completed;
      case FilterBy.completed:
        return todo.completed;
      default:
        return true;
    }
  });

  const activeTodos = todos.filter(todo => !todo.completed).length;

  const completedTodos = todos.filter(todo => todo.completed).length;

  useEffect(() => {
    client.get<Todo[]>(BASE_ADD_URL + URL_GET)
      .then(dTodos => setTodos(dTodos))
      .catch(() => setError(Errors.load));
  }, []);

  useEffect(() => {
    if (error) {
      setTimeout(() => setError(null), DELAY_ERROR);
    }
  }, [error]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <TodoHeader
          onAddTodo={addTodo}
        />
        {todos.length > 0 && (
          <>
            <section className="todoapp__main">
              <TodoList
                todos={todosToRender}
                tempTodo={tempTodo}
                isActiveLoaderTodos={hasTodoLoaderIds}
                onDeleteTodo={id => deleteTodo(id)}
              />
            </section>
            <TodoFooter
              onChangeFilter={applyFilter}
              filterSelected={filterBy}
              activeTodos={activeTodos}
              completedTodos={completedTodos}
              clearCompleted={clearCompleted}
            />
          </>
        )}
      </div>
      {error && (
        <Notification
          message={error}
          close={() => setError(null)}
        />
      )}
    </div>
  );
};
