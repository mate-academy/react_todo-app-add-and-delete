/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { Filter } from './types/Filter';
import { addTodo, deleteTodo, getTodos, USER_ID } from './api/Todos';
import { Todo } from './types/Todo';
import { UserWarning } from './UserWarning';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [title, setTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingTodos, setDeletingTodos] = useState<number[]>([]);
  //const [fadingTodos, setFadingTodos] = useState<number[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const hiddenError = (message: string) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(''), 3000);
  };

  useEffect(() => {
    setLoading(true);

    getTodos()
      .then(setTodos)
      .catch(() => hiddenError(`Unable to load todos`))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!loading) {
      inputRef.current?.focus();
    }
  }, [loading]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const trimTitle = title.trim();

    if (!trimTitle) {
      hiddenError('Title should not be empty');

      return;
    }

    const newTodo = {
      userId: USER_ID,
      title: trimTitle,
      completed: false,
    };

    const temp = { ...newTodo, id: 0 };

    setTempTodo(temp);
    setLoading(true);

    try {
      const createdTodo = await addTodo(newTodo);

      setTodos(prev => [...prev, createdTodo]);
      setTitle('');
    } catch {
      hiddenError('Unable to add a todo');
    } finally {
      setTempTodo(null);
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleDeleteTodo = async (id: number) => {
    setDeletingTodos(prev => [...prev, id]);
    try {
      await deleteTodo(id);
      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== id));
    } catch {
      hiddenError('Unable to delete a todo');
    } finally {
      setDeletingTodos(prev => prev.filter(todoId => todoId !== id));
      inputRef.current?.focus();
    }
  };

  const clearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    await Promise.allSettled(
      completedTodos.map(todo =>
        deleteTodo(todo.id)
          .then(() =>
            setTodos(current => current.filter(tod => tod.id !== todo.id)),
          )
          .catch(() => hiddenError('Unable to delete a todo')),
      ),
    );

    inputRef.current?.focus();
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          inputRef={inputRef}
          setTitle={setTitle}
          title={title}
          handleSubmit={handleSubmit}
          loading={loading}
        />

        <TodoList
          todos={todos}
          filter={filter}
          onDelete={handleDeleteTodo}
          tempTodo={tempTodo}
          loading={loading}
          deletingTodos={deletingTodos}
        />

        {todos.length > 0 && (
          <Footer
            todos={todos}
            status={filter}
            onChangeStatus={setFilter}
            onClearCompleted={clearCompleted}
          />
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        onClose={() => setErrorMessage('')}
      />
    </div>
  );
};
