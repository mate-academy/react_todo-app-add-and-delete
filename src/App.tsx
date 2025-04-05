/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { addTodos, deleteTodos, getTodos, USER_ID } from './api/todos';
import { Header } from './component/Header';
import { Section } from './component/Section/Section';
import { Footer } from './component/Footer/Footer';
import { Todo } from './types/Todo';
import { Error } from './component/Error';
import { Filter } from './types/Filter';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessege, setErrorMessege] = useState<string | null>(null);
  const [newTodo, setNewTodo] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [selectedFilter, setselectedFilter] = useState<string>(Filter.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingId, setloadingId] = useState<number[]>([]);

  const loadTodos = async (): Promise<void> => {
    setLoading(true);
    try {
      setTodos(await getTodos());
    } catch {
      setErrorMessege('Unable to load todos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const handleAddTodo = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!newTodo.trim()) {
      setErrorMessege('Title should not be empty');

      return;
    }

    setLoading(true);

    const addTodo = {
      id: todos.length + 1,
      userId: USER_ID,
      title: newTodo.trim(),
      completed: false,
    };

    try {
      setTempTodo(addTodo);
      setTodos([...todos, await addTodos(addTodo)]);
      setNewTodo('');
    } catch {
      setErrorMessege('Unable to add a todo');
    } finally {
      setTempTodo(null);
      setLoading(false);
    }
  };

  const handleDeleteTodo = async (id: number) => {
    setloadingId(prev => [...prev, id]);
    setLoading(true);
    try {
      await deleteTodos(id);
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
    } catch {
      setErrorMessege('Unable to delete a todo');
    } finally {
      setLoading(false);
    }
  };

  const filteredTodos = () => {
    switch (selectedFilter) {
      case Filter.Active:
        return todos.filter(todo => !todo.completed);
      case Filter.Completed:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  };

  const handleClearCompleted = () => {
    todos.forEach(todo => {
      if (todo.completed) {
        handleDeleteTodo(todo.id);
      }
    });
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header
          todos={todos}
          newTodo={newTodo}
          setNewTodo={setNewTodo}
          loading={loading}
          handleAddTodo={handleAddTodo}
          loadTodos={loadTodos}
        />
        {todos.length > 0 && (
          <>
            <Section
              tempTodo={tempTodo}
              todos={filteredTodos()}
              handleDeleteTodo={handleDeleteTodo}
              loading={loading}
              loadingId={loadingId}
            />
            {todos.length > 0 && (
              <Footer
                todos={todos}
                selectedFilter={selectedFilter}
                setselectedFilter={setselectedFilter}
                handleClearCompleted={handleClearCompleted}
              />
            )}
          </>
        )}
      </div>

      <Error errorMessege={errorMessege} setError={setErrorMessege} />
    </div>
  );
};
