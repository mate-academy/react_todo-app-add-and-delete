/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './components/UserWarning';
import {
  getTodos,
  postTodo,
  removeTodo,
  renewTodo,
  USER_ID,
} from './api/todos';
import { Todo } from './types/Todo';
import { ErrorComponent } from './components/ErrorComponent';
import { Footer } from './components/Footer';
import { getFilteredItems } from './utils/getFilteredItems';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Filter } from './utils/enamFilter';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>(
    Filter.All,
  );
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState<number | null>(null);
  const showError = (message: string) => {
    setError(message);

    setTimeout(() => {
      setError('');
    }, 3000);
  };

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => showError('Unable to load todos'))
      .finally(() => setLoading(0));
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const addTodo = (todoTitle: string) => {
    setLoading(1);
    setTempTodo({
      id: 0,
      userId: 2215,
      title: todoTitle,
      completed: false,
    });

    // Add a new todo
    postTodo(title.trim())
      .then((newTodo: Todo) => {
        setTodos(prevTodos => [...prevTodos, newTodo]);
        setError('');
        setTitle('');
      })
      .catch(() => showError('Unable to add a todo'))
      .finally(() => {
        setLoading(0);
        setTempTodo(null);
      });
  };

  const updateTodoCheck = (id: number) => {
    setLoading(id);

    const todoToUpdate = todos.find(todo => todo.id === id);

    if (!todoToUpdate) {
      setLoading(0);

      return;
    }

    const updatedTodo = {
      ...todoToUpdate,
      completed: !todoToUpdate.completed,
    };

    // Update a todo
    renewTodo(id, updatedTodo)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.map(todo =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo,
          ),
        );
        setLoading(0);
      })
      .catch(() => showError('Unable to update a todo'))
      .finally(() => setLoading(0));
  };

  const updateTodoTitle = (
    event: React.FormEvent,
    id: number,
    value: string,
  ) => {
    event.preventDefault();
    setLoading(id);

    const todoToUpdate = todos.find(todo => todo.id === id);

    if (!todoToUpdate) {
      setLoading(0);

      return;
    }

    const updatedTodo = {
      ...todoToUpdate,
      title: value,
    };

    // Update a todo
    renewTodo(id, updatedTodo)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.map(todo =>
            todo.id === id ? { ...todo, title: value } : todo,
          ),
        );
        setLoading(0);
      })
      .catch(() => showError('Unable to update a todo'))
      .finally(() => {
        setLoading(0);
      });
    // setEditTitle('');
  };

  const deleteTodo = (id: number) => {
    setLoading(id);

    // Remove a todo
    removeTodo(id)
      .then(() => setTodos(todos.filter(item => item.id !== id)))
      .catch(() => showError('Unable to delete a todo'))
      .finally(() => setLoading(0));
  };

  const clearCompleted = () => {
    const todosCompleted = todos.filter(todo => todo.completed);
    const successIds: number[] = [];

    Promise.all(
      todosCompleted.map(todo => {
        setLoading(todo.id);

        return removeTodo(todo.id)
          .then(() => successIds.push(todo.id))
          .catch(() => showError('Unable to delete a todo'));
      }),
    )
      .then(() => {
        setTodos(todos.filter(todo => !successIds.includes(todo.id)));
      })
      .catch(() => showError('Unable to delete a todo'))
      .finally(() => setLoading(0));
  };

  const filteredTodos = getFilteredItems(todos, filter);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          addTodo={addTodo}
          clearCompleted={clearCompleted}
          setError={setError}
          showError={showError}
          loading={loading}
          title={title}
          setTitle={setTitle}
        />

        <TodoList
          filteredTodos={filteredTodos}
          setError={setError}
          loading={loading}
          deleteTodo={deleteTodo}
          updateTodoCheck={updateTodoCheck}
          updateTodoTitle={updateTodoTitle}
          tempTodo={tempTodo}
        />

        {todos.length > 0 && (
          <Footer
            todos={todos}
            filter={filter}
            setFilter={setFilter}
            clearCompleted={clearCompleted}
          />
        )}
      </div>
      <ErrorComponent error={error} onClose={() => setError('')} />
    </div>
  );
};
