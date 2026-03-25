import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { deleteTodo, getTodos, addTodo, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorPutting } from './components/ErrorPutting';
import { Filter } from './types/Filter';
import { ErrorMessage } from './types/Error';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState<ErrorMessage | ''>('');
  const [selected, setSelected] = useState<Filter>(Filter.All);
  const [processings, setProcessings] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const todoFieldRef = useRef<HTMLInputElement>(null);

  const focusInput = () => {
    todoFieldRef.current?.focus();
  };

  async function handleDeleteTodo(todoId: number) {
    setErrorMessage('');
    try {
      setProcessings(prev => [...prev, todoId]);
      await deleteTodo(todoId);
      setTodos(current => current.filter(todo => todo.id !== todoId));
    } catch (error) {
      setErrorMessage(ErrorMessage.DeleteTodo);
    } finally {
      setProcessings(prev => prev.filter(id => id !== todoId));
      focusInput();
    }
  }

  async function handleAddTodo(event: React.FormEvent) {
    event.preventDefault();
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setErrorMessage(ErrorMessage.EmptyTitle);
      focusInput();

      return;
    }

    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    });
    setProcessings(prev => [...prev, 0]);
    setErrorMessage('');
    try {
      const newTodo = await addTodo({
        userId: USER_ID,
        title: trimmedTitle,
        completed: false,
      });

      setTodos(current => [...current, newTodo]);
      setTitle('');
    } catch (error) {
      setErrorMessage(ErrorMessage.AddTodo);
    } finally {
      setTempTodo(null);
      setProcessings(prev => prev.filter(id => id !== 0));
      setTimeout(() => {
        focusInput();
      }, 0);
    }
  }

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage(ErrorMessage.LoadTodos))
      .finally(() => focusInput());
  }, []);

  useEffect(() => {
    if (errorMessage) {
      const timingForError = setTimeout(() => setErrorMessage(''), 3000);

      return () => clearTimeout(timingForError);
    }

    return;
  }, [errorMessage]);

  const filteredTodos = todos.filter(todo => {
    if (selected === Filter.Active) {
      return !todo.completed;
    }

    if (selected === Filter.Completed) {
      return todo.completed;
    }

    return true;
  });

  const clearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.forEach(todo => {
      handleDeleteTodo(todo.id);
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
          title={title}
          setTitle={setTitle}
          onSubmit={handleAddTodo}
          isAdding={processings.includes(0)}
          todoFieldRef={todoFieldRef}
        />
        {(todos.length > 0 || tempTodo) && (
          <TodoList
            filteredTodos={filteredTodos}
            processings={processings}
            onDelete={handleDeleteTodo}
            tempTodo={tempTodo}
          />
        )}
        {todos.length > 0 && (
          <Footer
            todos={todos}
            selected={selected}
            setSelected={setSelected}
            onReset={clearCompleted}
          />
        )}
      </div>
      <ErrorPutting
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
