/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useCallback, useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  addTodo, deleteTodo, getTodos, updateTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import { TodoItem } from './components/TodoItem';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Error } from './components/Error';

const USER_ID = 11616;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [errorWarning, setErrorWarning] = useState('');
  const [pageIsLoaded, setPageIsLoaded] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isUpdatingId, setIsUpdatingId] = useState<number[]>([]);

  const input = document
    .querySelector<HTMLInputElement>('.todoapp__new-todo');

  const handleErrorSet = (errMessage: string) => {
    setErrorWarning(errMessage);
    setTimeout(() => {
      setErrorWarning('');
    }, 3000);
  };

  const closeError = () => {
    setErrorWarning('');
  };

  const loadTodos = async () => {
    try {
      const loadedTodos = await getTodos(USER_ID);

      setTodos(loadedTodos);
      setPageIsLoaded(true);
    } catch {
      handleErrorSet('load-todo');
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  useEffect(() => {
    input?.focus();
  }, [pageIsLoaded]);

  const visibleTodos = (filterBy: string) => {
    if (todos) {
      switch (filterBy) {
        case 'all':
          return todos;
        case 'active':
          return todos.filter(todo => (
            !todo.completed
          ));
        case 'completed':
          return todos.filter(todo => (
            todo.completed
          ));
        default: return todos;
      }
    }

    return todos;
  };

  const handleFormSubmit = async () => {
    if (query.trim().length < 1) {
      handleErrorSet('title-empty');

      return;
    }

    const newTodo = {
      id: todos.length > 0 ? todos[todos.length - 1].id + 1 : 1,
      userId: USER_ID,
      title: query.trim(),
      completed: false,
    };

    setTempTodo({ ...newTodo, id: 0 });

    try {
      setPageIsLoaded(false);
      await addTodo('/todos', newTodo)
        .then(() => {
          setTodos((state) => {
            return [...state, newTodo];
          });
          setTempTodo(null);
          setPageIsLoaded(true);
        });
      setQuery('');
    } catch {
      handleErrorSet('add-todo');
      setTempTodo(null);
      setPageIsLoaded(true);
    }
  };

  const handleComplete = async (id: number, completed: boolean) => {
    try {
      setIsUpdatingId(state => (
        [...state, id]
      ));
      await updateTodo(id, { completed: !completed })
        .then(() => {
          todos.map(todo => {
            if (todo.id === id) {
              // eslint-disable-next-line no-param-reassign
              todo.completed = !completed;
            }

            return todo;
          });
        });
      setIsUpdatingId((state) => (
        [...state.filter(stateId => stateId !== id)]
      ));
    } catch {
      handleErrorSet('update-todo');
      setIsUpdatingId((state) => (
        [...state.filter(stateId => stateId !== id)]
      ));
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setIsUpdatingId(state => (
        [...state, id]
      ));
      await deleteTodo(id)
        .then(() => setTodos((state) => {
          return [...state.filter(todo => todo.id !== id)];
        }));
      setIsUpdatingId((state) => (
        [...state.filter(stateId => stateId !== id)]
      ));
    } catch {
      handleErrorSet('delete-todo');
      setIsUpdatingId((state) => (
        [...state.filter(stateId => stateId !== id)]
      ));
    }
  };

  const handleMultipleDelete = async () => {
    try {
      todos.forEach(async (todo) => {
        if (todo.completed === true) {
          setIsUpdatingId(state => (
            [...state, todo.id]
          ));
          await deleteTodo(todo.id)
            .then(() => setTodos((state) => {
              return [...state.filter(todoF => todoF.id !== todo.id)];
            }));
          setIsUpdatingId((state) => (
            [...state.filter(stateId => stateId !== todo.id)]
          ));
        }
      });
    } catch {
      handleErrorSet('delete-todo');
      setIsUpdatingId([]);
    }
  };

  const completedTodos = useCallback(() => {
    return todos.filter(todo => todo.completed).length;
  }, [todos]);

  const uncompletedTodos = useCallback(() => {
    return todos.filter(todo => !todo.completed).length;
  }, [todos]);

  const toggleAll = async () => {
    const isStatus = !completedTodos();

    try {
      todos.map(async (todo) => {
        setIsUpdatingId(state => (
          [...state, todo.id]
        ));
        if (isStatus) {
          await updateTodo(todo.id, { completed: true })
            .then(() => {
              // eslint-disable-next-line no-param-reassign
              todo.completed = true;
              setIsUpdatingId([]);
            });
        } else {
          await updateTodo(todo.id, { completed: false })
            .then(() => {
              // eslint-disable-next-line no-param-reassign
              todo.completed = false;
              setIsUpdatingId([]);
            });
        }

        return todo;
      });
    } catch {
      handleErrorSet('update-todo');
      setIsUpdatingId([]);
    }
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todosLength={todos.length}
          handleFormSubmit={handleFormSubmit}
          query={query}
          setQuery={setQuery}
          uncompletedTodos={uncompletedTodos()}
          toggleAll={toggleAll}
          pageIsLoaded={pageIsLoaded}
        />
        {todos && (
          <TodoList
            todos={visibleTodos(filter)}
            handleComplete={handleComplete}
            handleDelete={handleDelete}
            isUpdatingId={isUpdatingId}
          />
        )}
        {tempTodo && (
          <TodoItem tempTodos={tempTodo} />
        )}

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <Footer
            filter={setFilter}
            filterValue={filter}
            completedTodos={completedTodos()}
            uncompletedTodos={uncompletedTodos()}
            handleMultipleDelete={handleMultipleDelete}
          />
        )}
      </div>
      <Error error={errorWarning} closeError={closeError} />
    </div>
  );
};
