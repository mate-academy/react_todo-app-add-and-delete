import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ErrorComponent } from './components/ErrorComponent';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [editingTodosId, setEditingTodosId] = useState<number[]>([]);
  const [isFooterActive, setIsFooterActiveFilter] = useState(false);
  const [filter, setFilter] = useState('all');

  async function loadAllTodos() {
    try {
      const loadedTodos = await getTodos();

      if (loadedTodos.length > 0) {
        setIsFooterActiveFilter(true);
      }

      setTodos(loadedTodos);
      setFilteredTodos(loadedTodos);
    } catch (e) {
      setError('Unable to load todos');
    }
  }

  useEffect(() => {
    loadAllTodos();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setError(null);
    }, 3000);
  }, [error]);

  useEffect(() => {
    if (todos.length === 0) {
      setIsFooterActiveFilter(false);

      return;
    }

    setIsFooterActiveFilter(true);
  }, [todos.length]);

  useEffect(() => {
    if (filter === 'completed') {
      setFilteredTodos(prev => prev.filter(t => t.completed));
    }

    if (filter === 'active') {
      setFilteredTodos(prev => prev.filter(t => !t.completed));
    }
  }, [filter, todos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header
          todos={todos}
          setEditingTodosId={setEditingTodosId}
          setError={setError}
          editingTodosId={editingTodosId}
          setTodos={setTodos}
          setFilteredTodos={setFilteredTodos}
          filteredTodos={filteredTodos}
        />
        <section className="todoapp__main" data-cy="TodoList">
          <TodoList
            filter={filter}
            filteredTodos={filteredTodos}
            editingTodosId={editingTodosId}
            setEditingTodosId={setEditingTodosId}
            setError={setError}
            todos={todos}
            setTodos={setTodos}
            setFilteredTodos={setFilteredTodos}
          />
        </section>
        <Footer
          filter={filter}
          setFilter={setFilter}
          setFilteredTodos={setFilteredTodos}
          todos={todos}
          isFooterActive={isFooterActive}
          setEditingTodosId={setEditingTodosId}
          loadAllTodos={loadAllTodos}
          setTodos={setTodos}
          setError={setError}
          editingTodosId={editingTodosId}
        />
      </div>

      <ErrorComponent error={error} setError={setError} />
    </div>
  );
};
