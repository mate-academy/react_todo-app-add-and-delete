import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';

import { TodoList } from './components/TodoList/TodoList';
import { Todo } from './type/Todo';
import { Header } from './components/Header/Header';
import cn from 'classnames';

import { Footer } from './components/Footer/Footer';
import { FilterOptions } from './type/filterOptions';
import { addTodo, deleteTodo, getTodos, USER_ID } from './api/todos';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string>('');
  const [filter, setFilter] = useState<FilterOptions>('all');

  const [newtitle, setNewTitle] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [deletingTodoIds, setDeletingTodoIds] = useState<number[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);

  const filteredTodos = todos.filter(todo => {
    if (filter === 'completed') {
      return todo.completed;
    }

    if (filter === 'active') {
      return !todo.completed;
    }

    return true;
  });

  useEffect(() => {
    setError('');

    getTodos()
      .then(setTodos)
      .catch(() => {
        setError('Unable to load todos');
      });
  }, []);

  useEffect(() => {
    if (!error) {
      return;
    }

    const timer = setTimeout(() => {
      setError('');
    }, 3000);

    return () => clearTimeout(timer);
  }, [error]);

  useEffect(() => {
    if (!loading) {
      inputRef.current?.focus();
    }
  }, [loading]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  function handleAddPost({ userId = USER_ID, title, completed = false }: Todo) {
    setLoading(true);

    addTodo({ userId, title, completed })
      .then(newTodo => {
        setTodos(prevTodos => [...prevTodos, newTodo]);
        setNewTitle('');
      })
      .catch(() => setError('Unable to add a todo'))
      .finally(() => {
        setLoading(false);
        setTempTodo(null);
      });
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const trimmedTitle = newtitle.trim();

    if (!trimmedTitle) {
      return setError('Title should not be empty');
    }

    setLoading(true);

    const templateNewTodo: Todo = {
      userId: USER_ID,
      id: 0,
      title: trimmedTitle,
      completed: false,
    };

    setTempTodo(templateNewTodo);

    handleAddPost(templateNewTodo);
  }

  function handleDeletePost(todoId: number) {
    setDeletingTodoIds(currentIds => [...currentIds, todoId]);

    deleteTodo(todoId)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
        inputRef.current?.focus();
      })
      .catch(() => {
        setError('Unable to delete a todo');
      });
  }

  function handleClearCompleted() {
    todos.map(todo => {
      if (todo.completed) {
        handleDeletePost(todo.id);
      }
    });
  }

  const activeTodo = todos.every(todo => todo.completed);

  const hasCompletedTodos = todos.some(todo => todo.completed);

  const activeTodoCount = todos.filter(todo => !todo.completed).length;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          activeTodo={activeTodo}
          title={newtitle}
          setTitle={setNewTitle}
          inputRef={inputRef}
          onSubmit={handleSubmit}
          loading={loading}
        />

        {todos.length > 0 && (
          <TodoList
            todos={filteredTodos}
            tempTodo={tempTodo}
            onDelete={handleDeletePost}
            deletingTodoIds={deletingTodoIds}
          />
        )}
        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <Footer
            filter={filter}
            setFilter={setFilter}
            hasCompletedTodos={hasCompletedTodos}
            activeTodoCount={activeTodoCount}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !error },
        )}
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
