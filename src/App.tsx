import React, { useEffect, useState, useRef } from 'react';
import { getTodos, addTodo, deleteTodo } from './api/todos';
import { TodoList } from './components/TodoList';
import { TodoHeader } from './components/TodoHeader';
import { Todo } from './types/Todo';
import { FilterType } from './types/enum';
import './styles/index.scss';
import './styles/todoapp.scss';
import './styles/filter.scss';
import { TodoFooter } from './components/TodoFooter';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [error, setError] = useState<string>('');
  const [newTodo, setNewTodo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingTodos, setLoadingTodos] = useState<number[]>([]);
  const [filter, setFilter] = useState<FilterType>(FilterType.All);

  const inputRef = useRef<HTMLInputElement>(null);

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') {
      return !todo.completed;
    }

    if (filter === 'completed') {
      return todo.completed;
    }

    return true;
  });

  const handleAdd = async (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedTitle = newTodo.trim();

    if (!trimmedTitle) {
      setError('Title should not be empty');

      return;
    }

    const tempTodoItem: Todo = {
      id: 0,
      userId: 1,
      title: trimmedTitle,
      completed: false,
    };

    setTempTodo(tempTodoItem);
    setIsLoading(true);

    try {
      const newTodoItem = { title: trimmedTitle, completed: false }; // Обрізаємо тут теж
      const savedTodo = await addTodo(newTodoItem);

      setTodos([...todos, savedTodo]);
      setNewTodo('');
      setTempTodo(null);
    } catch {
      setError('Unable to add a todo');
      setTempTodo(null);
    } finally {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    setLoadingTodos(prev => [...prev, id]);
    try {
      await deleteTodo(id);
      setTodos(todos.filter(todo => todo.id !== id));

      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    } catch (err) {
      setError('Unable to delete a todo');
      inputRef.current?.focus();
    }

    inputRef.current?.focus();
  };

  const handleToggle = (id: number) => {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  const handleClearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    const results = await Promise.allSettled(
      completedTodos.map(todo => deleteTodo(todo.id)),
    );

    const successfulDeletes = completedTodos.filter(
      (_, index) => results[index].status === 'fulfilled',
    );

    setTodos(prev => prev.filter(todo => !successfulDeletes.includes(todo)));

    if (results.some(result => result.status === 'rejected')) {
      setError('Unable to delete a todo');
    }
  };

  useEffect(() => {
    const loadTodos = async () => {
      setError('');
      setIsLoading(true);
      try {
        const loadedTodos = await getTodos();

        setTodos(loadedTodos);
      } catch {
        inputRef.current?.focus();
        setError('Unable to load todos');
      } finally {
        setIsLoading(false);
        setTimeout(() => {
          inputRef.current?.focus();
        }, 100);
      }
    };

    loadTodos();
  }, []);

  useEffect(() => {
    if (!error) {
      return;
    }

    const timer = setTimeout(() => setError(''), 3000);

    return () => clearTimeout(timer);
  }, [error]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <TodoHeader
          newTodo={newTodo}
          setNewTodo={setNewTodo}
          handleAdd={handleAdd}
          isLoading={isLoading}
          inputRef={inputRef}
          todos={todos}
        />

        <TodoList
          filteredTodos={filteredTodos}
          isLoading={isLoading}
          handleToggle={handleToggle}
          handleDelete={handleDelete}
          loadingTodos={loadingTodos}
          tempTodo={tempTodo}
        />

        <TodoFooter
          setFilter={setFilter}
          filter={filter}
          handleClearCompleted={handleClearCompleted}
          todos={todos}
        />
      </div>

      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${error ? '' : 'hidden'}`}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setError('')}
        />
        {error}
      </div>
    </div>
  );
};
