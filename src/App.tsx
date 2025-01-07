/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import { addTodos, getTodos, USER_ID } from './api/todos';
import { TodoList } from './components/todo/TodoList';
import { Todo } from './types/Todo';
import { Footer } from './components/footer/Footer';
// eslint-disable-next-line max-len
import { ErrorNotification } from './components/errorNotification/ErrorNotification';
import { Header } from './components/header/Header';
// eslint-disable-next-line max-len

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [errorMesage, setErrorMesage] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const todo = await getTodos();

        setTodos(todo);
      } catch {
        setErrorMesage('Unable to load todos');
      }
    };

    fetchTodos();
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const filteredTodos = useMemo(() => {
    let filtered = [...todos];

    switch (statusFilter) {
      case 'all':
        return filtered;
      case 'active':
        return (filtered = filtered.filter(todo => !todo.completed));
      case 'completed':
        return (filtered = filtered.filter(todo => todo.completed));

      default:
        return filtered;
    }
  }, [statusFilter, todos]);

  const onAdd = async (title: string) => {
    const newTempTodo = {
      id: 0,
      title: title,
      completed: false,
      userId: USER_ID,
    };

    setTempTodo(newTempTodo);

    try {
      const addedTodo = await addTodos({
        title,
        userId: USER_ID,
        completed: false,
      });

      setTodos(prev => [...prev, addedTodo]);
    } catch {
      setErrorMesage('Unable to add a todo');
    } finally {
      setTempTodo(null);
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header setError={setErrorMesage} onAdd={onAdd} />
        <TodoList
          todoList={filteredTodos}
          setError={setErrorMesage}
          setTodoList={setTodos}
          tempTodo={tempTodo}
        />
        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <Footer
            todos={todos}
            statusFilter={statusFilter}
            setFilterStatus={setStatusFilter}
            setTodoList={setTodos}
            setError={setErrorMesage}
          />
        )}
      </div>
      <ErrorNotification
        error={errorMesage}
        onClose={() => setErrorMesage('')}
      />
    </div>
  );
};
