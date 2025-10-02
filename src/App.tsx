import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { TodoList } from './components/TodoList';
import { Todo } from '../types/Todo';
import {
  createTodo,
  getTodos,
  removeTodo,
  updateTodo,
  USER_ID,
} from '../api/todos';
import classNames from 'classnames';
import { Filter } from '../types/Filter';

export const App: React.FC = () => {
  const [todoTitle, setTodoTitle] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [message, setMessage] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<Filter>(Filter.All);
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const withLoader = (id: number, callback: () => void) => {
    setLoadingTodoIds(prev => [...prev, id]);
    setTimeout(() => {
      callback();
      setLoadingTodoIds(prev => prev.filter(lid => lid !== id));
    }, 200);
  };

  const toggleTodoAll = () => {
    const allCompleted = todos.every(t => t.completed);
    const updatedTodos = todos.map(t => ({ ...t, completed: !allCompleted }));

    setTodos(updatedTodos);
  };

  const filteredTodos = todos.filter(todo => {
    if (selectedFilter === Filter.Active) {
      return !todo.completed;
    }

    if (selectedFilter === Filter.Completed) {
      return todo.completed;
    }

    return true;
  });

  useEffect(() => {
    const loaderId = 0;

    setLoadingTodoIds(prev => [...prev, loaderId]);
    getTodos()
      .then(fetchedTodos => setTodos(fetchedTodos))
      .catch(() => setMessage('Unable to load todos'))
      .finally(() =>
        setLoadingTodoIds(prev => prev.filter(id => id !== loaderId)),
      );
  }, []);

  useEffect(() => {
    if (!message) {
      return;
    }

    const timer = setTimeout(() => setMessage(''), 3000);

    return () => clearTimeout(timer);
  }, [message]);

  useEffect(() => {
    const input = inputRef.current;

    if (input && !isCreating && loadingTodoIds.length === 0) {
      const timer = setTimeout(() => input.focus(), 0);

      return () => clearTimeout(timer);
    }

    return undefined;
  }, [isCreating, loadingTodoIds]);

  const handleAddTodo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedTitle = todoTitle.trim();

    if (!trimmedTitle) {
      return setMessage('Title should not be empty');
    }

    setIsCreating(true);
    const temp: Todo = {
      id: 0,
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    };

    setTempTodo(temp);

    try {
      const savedTodo = await createTodo({
        userId: USER_ID,
        title: trimmedTitle,
        completed: false,
      });

      setTodos(prev => [...prev, savedTodo]);
      setTodoTitle('');
    } catch {
      setMessage('Unable to add a todo');
    } finally {
      setTempTodo(null);
      setIsCreating(false);
      inputRef.current?.focus();
    }
  };

  const saveTodo = (id: number, title: string) =>
    withLoader(id, async () => {
      try {
        await updateTodo(id, { title });
        setTodos(prev => prev.map(t => (t.id === id ? { ...t, title } : t)));
      } catch {
        setMessage('Failed to update todo');
      }
    });

  const deleteTodo = (id: number) =>
    withLoader(id, async () => {
      try {
        await removeTodo(id);
        setTodos(prev => prev.filter(t => t.id !== id));
      } catch {
        setMessage('Unable to delete a todo');
      }
    });

  const clearCompleted = async () => {
    const completedTodos = todos.filter(t => t.completed);
    const loaderId = Date.now();

    setLoadingTodoIds(prev => [...prev, loaderId]);
    const failed: number[] = [];

    await Promise.all(
      completedTodos.map(async t => {
        try {
          await removeTodo(t.id);
        } catch {
          failed.push(t.id);
        }
      }),
    );
    setTodos(prev => prev.filter(t => failed.includes(t.id) || !t.completed));
    if (failed.length) {
      setMessage('Unable to delete a todo');
    }

    setLoadingTodoIds(prev => prev.filter(id => id !== loaderId));
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todoTitle={todoTitle}
          setTodoTitle={setTodoTitle}
          todos={todos}
          handleAddTodo={handleAddTodo}
          inputRef={inputRef}
          loadingTodoIds={loadingTodoIds}
          isCreating={isCreating}
          toggleTodoAll={toggleTodoAll}
        />

        <TodoList
          todos={filteredTodos}
          editingTodoId={editingTodoId}
          setEditingTodoId={setEditingTodoId}
          editingTitle={editingTitle}
          setEditingTitle={setEditingTitle}
          saveTodo={saveTodo}
          deleteTodo={deleteTodo}
          loadingTodoIds={loadingTodoIds}
          tempTodo={tempTodo}
        />

        {todos.length > 0 && (
          <Footer
            todos={todos}
            selectedFilter={selectedFilter}
            setSelectedFilter={setSelectedFilter}
            clearCompleted={clearCompleted}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          { hidden: !message },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setMessage('')}
        />
        {message}
      </div>
    </div>
  );
};
