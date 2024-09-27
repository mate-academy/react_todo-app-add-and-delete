/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef } from 'react';
import {
  getTodos,
  addTodo,
  deleteTodo,
  updateTodo,
  USER_ID,
} from './api/todos';
import { useState } from 'react';
import { Todo } from './types/Todo';
import { Footer } from './components/Footer';
import { Notifications } from './components/Notifications';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);

  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [filtered, setFiltered] = useState<Todo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletedIds, setDeletedIds] = useState<number[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadTodos = async () => {
      try {
        const fetchedTodos = await getTodos();

        setTodos(fetchedTodos);
        setFiltered(fetchedTodos);
      } catch (er) {
        setError('Unable to load todos');
        setTimeout(() => setError(null), 3000);
      }
    };

    loadTodos();
  }, []);

  const handleAddTodo = async () => {
    const trimmedTitle = newTodoTitle.trim();

    if (!trimmedTitle) {
      setError('Title should not be empty');
      setTimeout(() => setError(null), 3000);

      return;
    }

    setIsSubmitting(true);
    const newTempTodo = {
      id: 0,
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    };

    setTempTodo(newTempTodo);
    setLoading(true);
    try {
      const newTodo = await addTodo({
        title: trimmedTitle,
        userId: USER_ID,
        completed: false,
      });

      setTodos([...todos, newTodo]);
      setNewTodoTitle('');
      setError(null);
    } catch (er) {
      setError('Unable to add a todo');
      setNewTodoTitle(trimmedTitle);
      setTimeout(() => setError(null), 3000);
    } finally {
      setTempTodo(null);
      setLoading(false);
      setIsSubmitting(false);
      inputRef.current?.focus();
    }
  };

  const handleUpdateTodo = async (data: Todo) => {
    setLoading(true);
    try {
      await updateTodo(data.id, { title: data.title });
      const fetchedTodos = await getTodos();

      setTodos(fetchedTodos);
    } catch (e) {
      setError('Unable to update a todo');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTodo = async (todoId: number) => {
    setLoading(true);
    setDeletedIds(prevIds => [...prevIds, todoId]);
    try {
      await deleteTodo(todoId);
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
    } catch (er) {
      setError('Unable to delete a todo');
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
      setDeletedIds(prevIds => prevIds.filter(id => id !== todoId));
    }
  };

  const handleToggleTodo = async (todo: Todo) => {
    setLoading(true);
    try {
      const updatedTodo = await updateTodo(todo.id, {
        completed: !todo.completed,
      });

      setTodos(prevTodos =>
        prevTodos.map(t => (t.id === todo.id ? updatedTodo : t)),
      );
    } catch {
      setError('Failed to update todo');
    } finally {
      setLoading(false);
    }
  };

  const handleAllToggleTodo = () => {
    const areAllCompleted = todos.every(todo => todo.completed);
    const updatedTodo = todos.map(todo => ({
      ...todo,
      completed: !areAllCompleted,
    }));

    setTodos(updatedTodo);
  };

  useEffect(() => {
    const filteredTodos = todos.filter(todo => {
      if (filter === 'active') {
        return !todo.completed;
      }

      if (filter === 'completed') {
        return todo.completed;
      }

      return filter === 'all';
    });

    setFiltered(filteredTodos);
  }, [filter, todos]);

  const handleClearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed).map(todo => todo.id);

    for (const id of completedTodos) {
      try {
        await deleteTodo(id);
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
      } catch {
        setError('Unable to delete a todo');
        setTimeout(() => setError(null), 3000);
      }
    }
  };


  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header
          title={newTodoTitle}
          setTitle={setNewTodoTitle}
          todos={todos}
          onChange={handleAllToggleTodo}
          onAddTodo={handleAddTodo}
          isSubmitting={isSubmitting}
          error={error}
        />

        <TodoList
          loading={loading}
          todos={filtered}
          tempTodo={tempTodo}
          onDeleteTodo={handleDeleteTodo}
          onUpdateTodo={handleToggleTodo}
          onUpdateTitleTodo={handleUpdateTodo}
          isSubmitting={isSubmitting}
          deletedIds={deletedIds}
        />

        {todos.length > 0 && (
          <Footer
            todos={todos}
            filter={filter}
            setFilter={setFilter}
            onClick={handleClearCompleted}
          />
        )}
      </div>
      {/* Add the 'hidden' class to hide the message smoothly */}

      <Notifications errorMessage={error} onClose={() => setError(null)} />
    </div>
  );
};
