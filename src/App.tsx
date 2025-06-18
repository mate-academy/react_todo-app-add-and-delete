/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './components/UserWarning';
import {
  deleteTodo,
  getTodos,
  patchTodo,
  postTodo,
  USER_ID,
} from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ShowError } from './components/ShowError';
import { Status } from './types/Status';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Status>(Status.All);
  const [inputValue, setInputValue] = useState('');
  const [loadingIds, setLoadingIds] = useState<number[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);

  const isLoading = loadingIds.length > 0;

  const addLoading = (id: number) => {
    setLoadingIds(prev => [...prev, id]);
  };

  const removeLoading = (id: number) => {
    setLoadingIds(prev => prev.filter(loadingId => loadingId !== id));
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 3000);

      return () => clearTimeout(timer);
    }

    return;
  }, [error]);

  useEffect(() => {
    if (USER_ID) {
      const globalId = -3;

      addLoading(globalId);

      getTodos()
        .then(setTodos)
        .catch(() => setError('Unable to load todos'))
        .finally(() => removeLoading(globalId));
    }
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const filteredTodos = todos.filter(todo => {
    if (filter === Status.All) {
      return true;
    }

    if (filter === Status.Active) {
      return !todo.completed;
    }

    if (filter === Status.Completed) {
      return todo.completed;
    }

    return true;
  });

  const ToggleAllTodos = () => {
    const globalId = -1;

    addLoading(globalId);

    const TodosAreCompleted = todos.every(todo => todo.completed);
    const updatedTodos = todos.map(todo => ({
      ...todo,
      completed: !TodosAreCompleted,
    }));

    setTodos(updatedTodos);

    removeLoading(globalId);
  };

  const clearCompleted = () => {
    const globalId = -2;

    addLoading(globalId);

    const completedIds = todos.filter(t => t.completed).map(t => t.id);

    if (completedIds.length === 0) {
      removeLoading(globalId);

      return;
    }

    Promise.allSettled(completedIds.map(id => deleteTodo(id).then(() => id)))
      .then(results => {
        const succeededIds = results
          .filter(r => r.status === 'fulfilled')
          .map(r => r.value as number);

        const hadFailure = results.some(r => r.status === 'rejected');

        if (hadFailure) {
          setError('Unable to delete a todo');
        }

        setTodos(prev => prev.filter(t => !succeededIds.includes(t.id)));
      })
      .finally(() => removeLoading(globalId));
  };

  const addTodo = (newTodo: Omit<Todo, 'id'>) => {
    const tempId = 0;

    addLoading(tempId);
    const temp = { ...newTodo, id: tempId };

    setTempTodo(temp);

    postTodo(newTodo)
      .then(createdTodo => {
        setTodos(currentTodo => [...currentTodo, createdTodo]);
        setTempTodo(null);
        setInputValue('');
      })
      .catch(() => {
        setError('Unable to add a todo');
        setTempTodo(null);
      })
      .finally(() => removeLoading(tempId));
  };

  const toggleTodoCompleted = (id: number) => {
    addLoading(id);

    const todo = todos.find(t => t.id === id);

    if (!todo) {
      return;
    }

    patchTodo(id, { completed: !todo.completed })
      .then(updatedTodo => {
        setTodos(prev => prev.map(t => (t.id === id ? updatedTodo : t)));
      })
      .catch(() => setError('Unable to update a todo'))
      .finally(() => removeLoading(id));
  };

  const deleteTodoById = (id: number) => {
    addLoading(id);

    deleteTodo(id)
      .then(() => {
        setTodos(prev => prev.filter(t => t.id !== id));
      })
      .catch(() => setError('Unable to delete a todo'))
      .finally(() => removeLoading(id));
  };

  const updateTodoTitle = (id: number, newTitle: string) => {
    addLoading(id);

    patchTodo(id, { title: newTitle })
      .then(updatedTodo => {
        setTodos(prev => prev.map(t => (t.id === id ? updatedTodo : t)));
      })
      .catch(() => setError('Unable to update a todo'))
      .finally(() => removeLoading(id));
  };

  const handleError = () => {
    setError(null);
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          onSubmit={addTodo}
          todos={todos}
          ToggleAllTodos={ToggleAllTodos}
          setError={setError}
          isLoading={isLoading}
          inputRef={inputRef}
          inputValue={inputValue}
          setInputValue={setInputValue}
        />

        <TodoList
          filteredTodos={filteredTodos}
          tempTodo={tempTodo}
          loadingIds={loadingIds}
          toggleTodoCompleted={toggleTodoCompleted}
          deleteTodo={deleteTodoById}
          updateTodoTitle={updateTodoTitle}
          inputRef={inputRef}
        />

        {todos.length > 0 && (
          <Footer
            todos={todos}
            clearCompleted={clearCompleted}
            filter={filter}
            setFilter={setFilter}
          />
        )}
      </div>

      <ShowError error={error} handleError={handleError} />
    </div>
  );
};
