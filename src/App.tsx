/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect, useRef } from 'react';
import { getTodos, uploadTodo, deleteTodo } from './api/todos';
import { USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import Footer from './components/Footer';
import ErrorNotification from './components/ErrorNotification';
import classNames from 'classnames';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [filter, setFilter] = useState('all');
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [haveId, sethaveId] = useState<number[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadTodos = async () => {
      setLoading(true);
      setError('');

      try {
        const todosFromApi = await getTodos();

        setTodos(todosFromApi);
      } catch {
        setError('Unable to load todos');
      } finally {
        setLoading(false);
      }
    };

    if (USER_ID) {
      loadTodos();
    }
  }, []);

  useEffect(() => {
    if (!loading && !isSubmitting) {
      inputRef.current?.focus();
    }
  }, [loading, isSubmitting]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleAddTodo = async (title: string) => {
    if (!title.trim()) {
      setError('Title should not be empty');

      return;
    }

    setIsSubmitting(true);
    setNewTodoTitle('');
    setTempTodo({
      id: 0,
      title,
      completed: false,
      userId: USER_ID,
      deleting: 'idle',
    });

    try {
      const newTodo = await uploadTodo({
        title: title.trim(),
        completed: false,
        userId: USER_ID,
        deleting: 'idle',
      });

      setTodos(prevTodos => [...prevTodos, newTodo]);
      setTempTodo(null);
      setError('');
      inputRef.current?.focus();
    } catch {
      setError('Unable to add a todo');
      setTempTodo(null);
      setNewTodoTitle(title);
    } finally {
      setIsSubmitting(false);
      setLoading(false);
      setTempTodo(null);
    }
  };

  const handleDeleteTodo = async (todoId: number) => {
    sethaveId(prev => [...prev, todoId]);
    try {
      setTodos(prevTodos =>
        prevTodos.map(todo =>
          todo.id === todoId ? { ...todo, deleting: 'deleting' } : todo,
        ),
      );

      await deleteTodo(todoId);

      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
    } catch {
      setError('Unable to delete a todo');
      setTodos(prevTodos =>
        prevTodos.map(todo =>
          todo.id === todoId ? { ...todo, deleting: 'idle' } : todo,
        ),
      );
    } finally {
      inputRef.current?.focus();
      setLoading(false);
      sethaveId(prev => prev.filter(id => id !== todoId));
    }
  };

  const handleClearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    sethaveId(completedTodos.map(todo => todo.id));
    const deletePromises = completedTodos.map(todo => deleteTodo(todo.id));

    try {
      await Promise.all(deletePromises);
      setTodos(prevTodos => prevTodos.filter(todo => !todo.completed));
    } catch {
      setError('Unable to delete completed todos');
    } finally {
      sethaveId([]);
    }
  };

  const handleToggleAll = () => {
    const allCompleted = todos.every(todo => todo.completed);

    setTodos(todos.map(todo => ({ ...todo, completed: !allCompleted })));
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') {
      return !todo.completed;
    }

    if (filter === 'completed') {
      return todo.completed;
    }

    return true;
  });

  return (
    <div className="todoapp">
      <h1 className="todoapp__title" data-cy="TodoAppTitle">
        todos
      </h1>
      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            aria-label="Mark all as completed"
            className={classNames('todoapp__toggle-all', {
              active: todos.every(todo => todo.completed),
            })}
            onClick={handleToggleAll}
            data-cy="ToggleAllButton"
          />
          <TodoForm
            onAddTodo={handleAddTodo}
            newTodoTitle={newTodoTitle}
            setNewTodoTitle={setNewTodoTitle}
            isSubmitting={isSubmitting}
            inputRef={inputRef}
          />
        </header>

        <TodoList
          todos={filteredTodos}
          tempTodo={tempTodo}
          haveId={haveId}
          setTodos={setTodos}
          onDeleteTodo={handleDeleteTodo}
        />

        {todos.length > 0 && (
          <Footer
            todos={todos}
            filter={filter}
            onFilterChange={setFilter}
            onClearCompleted={handleClearCompleted}
            haveId={haveId}
          />
        )}
      </div>

      <ErrorNotification error={error} onClose={() => setError('')} />
    </div>
  );
};
