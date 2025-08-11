/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import * as todoService from './services/todos';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [updatingTodoIds, setUpdatingTodoIds] = useState<number[]>([]);

  type FilterType = 'all' | 'active' | 'completed';
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const loadTodos = async () => {
    setLoading(true);
    setErrorMessage('');

    try {
      const loadedTodos = await todoService.getTodos();

      setTodos(loadedTodos);
    } catch {
      setErrorMessage('Unable to load todos');
    } finally {
      setLoading(false);

      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    }
  };

  useEffect(() => {
    if (!todoService.USER_ID) {
      return;
    }

    loadTodos();
  }, []);

  const filteredTodos = todos.filter(todo => {
    if (activeFilter === 'active') {
      return !todo.completed;
    }

    if (activeFilter === 'completed') {
      return todo.completed;
    }

    return true;
  });

  const incompleteCount = todos.filter(todo => !todo.completed).length;

  const toggleTodo = (id: number) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  const addTodo = async (title: string) => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setErrorMessage('Title should not be empty');

      return;
    }

    setLoading(true);

    const newTempTodo: Todo = {
      id: 0,
      userId: todoService.USER_ID,
      title: trimmedTitle,
      completed: false,
    };

    setTempTodo(newTempTodo);
    setUpdatingTodoIds(ids => [...ids, 0]);

    todoService
      .createTodo({
        userId: todoService.USER_ID,
        title: trimmedTitle,
        completed: false,
      })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setInputValue('');
      })
      .catch(() => {
        setErrorMessage(`Unable to add a todo`);
      })
      .finally(() => {
        setTempTodo(null);
        setLoading(false);
        setUpdatingTodoIds(ids => ids.filter(id => id !== 0));
      });
  };

  const inputRef = useRef<HTMLInputElement>(null);

  const deleteTodo = async (todoId: number) => {
    setLoading(true);
    setUpdatingTodoIds(prevId => [...prevId, todoId]);

    try {
      await todoService.deleteTodo(todoId);

      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
    } catch {
      setErrorMessage('Unable to delete a todo');
    } finally {
      setLoading(false);
      setUpdatingTodoIds(prevId => prevId.filter(id => id !== todoId));
    }
  };

  const handleDeleteCompletedTodos = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    if (completedTodos.length === 0) {
      setErrorMessage('Unable to delete a todo');

      return;
    }

    setLoading(true);
    completedTodos.forEach(todo => deleteTodo(todo.id));
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          onAdd={addTodo}
          todos={todos}
          loading={loading}
          disabled={loading}
          inputValue={inputValue}
          setInputValue={setInputValue}
          inputRef={inputRef}
        />
        <TodoList
          todos={filteredTodos}
          toggleTodo={toggleTodo}
          updatingTodoIds={updatingTodoIds}
          loading={loading}
          tempTodo={tempTodo}
          onDelete={deleteTodo}
        />

        {todos.length > 0 && (
          <Footer
            todos={todos}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            incompleteCount={incompleteCount}
            onClearCompleted={handleDeleteCompletedTodos}
          />
        )}
      </div>

      <ErrorNotification
        message={errorMessage}
        onClose={() => setErrorMessage('')}
      />
    </div>
  );
};
