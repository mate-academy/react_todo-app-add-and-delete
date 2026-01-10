/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState, useRef } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, createTodo, deleteSomeTodo, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { Error } from './components/Error';
import { Footer } from './components/Footer';
import { Filter } from './types/FilterMethods';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';

const TEMP_ID = -1;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [titlename, setTitlename] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<Filter>('All');
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  /*const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);*/

  useEffect(() => {
    setLoading(true);
    getTodos()
      .then(fetchedTodos => {
        setTodos(fetchedTodos);
        setError(null);
      })
      .catch(() => {
        setError('Unable to load todos');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 3000);

      return () => clearTimeout(timer);
    }

    return undefined;
  }, [error]);

  const filteredTodos = todos.filter(todo => {
    if (status === 'Active') {
      return !todo.completed;
    }

    if (status === 'Completed') {
      return todo.completed;
    }

    return true;
  });

  const countOfItemsLeft = (elements: Todo[]) => {
    const filtered = elements.filter(
      element => element.completed === false && element.id > 0,
    );

    return filtered.length;
  };

  const handleAllToggleTodo = () => {
    const areAllCompleted = todos.every(todo => todo.completed);
    const updatedTodos = todos.map(todo => ({
      ...todo,
      completed: !areAllCompleted,
    }));

    setTodos(updatedTodos);
  };

  const clearCompleted = () => {
    const completedTodos = todos.filter(t => t.completed);
    const deletePromises = completedTodos.map(todo =>
      deleteSomeTodo(todo.id)
        .then(() => ({ success: true, id: todo.id }))
        .catch(() => ({ success: false, id: todo.id })),
    );

    Promise.all(deletePromises).then(results => {
      const failed = results.filter(r => !r.success);

      if (failed.length > 0) {
        setError('Unable to delete a todo');
      }

      const successfulIds = results.filter(r => r.success).map(r => r.id);

      setTodos(current => current.filter(t => !successfulIds.includes(t.id)));
      if (failed.length === 0) {
        setTimeout(() => inputRef.current?.focus(), 0);
      }
    });
  };

  const allCompleted = todos.length > 0 && todos.every(todo => todo.completed);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitlename(event.target.value);
  };

  function deleteTodoItem(id: number) {
    setDeletingId(id);
    deleteSomeTodo(id)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
        setDeletingId(null);
        setTimeout(() => inputRef.current?.focus(), 0);
      })
      .catch(() => {
        setError('Unable to delete a todo');
        setDeletingId(null);
      });
  }

  function addTodo({ title, userId, completed }: Omit<Todo, 'id'>) {
    createTodo({ title, userId, completed })
      .then(newTodo => {
        setTodos(prev =>
          prev.map(todo => (todo.id === TEMP_ID ? newTodo : todo)),
        );
        setTitlename('');
        setIsAdding(false);
        setTimeout(() => inputRef.current?.focus(), 0);
      })
      .catch(() => {
        setTodos(prev => prev.filter(todo => todo.id !== TEMP_ID));
        setError('Unable to add a todo');
        setIsAdding(false);
        setTimeout(() => inputRef.current?.focus(), 0);
      });
  }

  const handleSubmitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (titlename.trim() === '') {
      setError('Title should not be empty');

      return;
    }

    setIsAdding(true);
    setTodos(prev => [
      ...prev,
      {
        id: TEMP_ID,
        title: titlename.trim(),
        completed: false,
        userId: USER_ID,
      },
    ]);
    addTodo({ title: titlename.trim(), userId: USER_ID, completed: false });
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          allCompleted={allCompleted}
          toggleAll={handleAllToggleTodo}
          titlename={titlename}
          handleTitleChange={handleTitleChange}
          handleSubmitForm={handleSubmitForm}
          isAdding={isAdding}
          inputRef={inputRef}
        />

        <TodoList
          todos={filteredTodos}
          loading={loading}
          deleteTodoItem={deleteTodoItem}
          deletingId={deletingId}
        />

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <Footer
            count={countOfItemsLeft}
            todos={todos}
            setMethod={setStatus}
            filterMethod={status}
            clear={clearCompleted}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <Error error={error} />
    </div>
  );
};
