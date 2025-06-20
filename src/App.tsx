/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useRef, useEffect } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { TodoList } from './components/todoList/todoList';
import * as API from './api/todos';
import { Todo } from './types/Todo';
import { TodosHeader } from './components/header/todosHeader';
import { TodosFooter } from './components/footer/todosFooter'; // eslint-disable-next-line
import { ErrorNotification } from './components/errorNotification/errorNotification';

export const App: React.FC = () => {
  const [todosFromServer, setTodosFromServer] = React.useState<Todo[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [inputValue, setInputValue] = React.useState('');
  const [filter, setFilter] = React.useState<string>('all');
  const [tempTodo, setTempTodo] = React.useState<Todo | null>(null);
  const [deletedTodos, setDeletedTodos] = React.useState<number[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setError(null); // Reset error state before fetching todos

    API.getTodos()
      .then(todos => {
        setTodosFromServer(todos);
      })
      .catch(() => {
        setError('Unable to load todos');
      });
  }, []);

  const handleHideError = () => {
    setError(null);
  };

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
  };

  const handleAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedInput = inputValue.trim();

    if (trimmedInput === '') {
      setError('Title should not be empty');

      return;
    }

    const newTodo = {
      title: trimmedInput,
      userId: USER_ID,
      completed: false,
    };

    setTempTodo({ id: 0, ...newTodo });

    API.addTodo(newTodo as Todo)
      .then(todo => {
        setTodosFromServer(prevTodos => [...prevTodos, todo]);
        setInputValue(''); // Clear input field after adding
      })
      .catch(() => {
        setError('Unable to add a todo');
      })
      .finally(() => {
        setTempTodo(null); // Clear the temporary todo state after adding
        setTimeout(() => {
          inputRef.current?.focus(); // Focus the input field after adding a todo
        }, 0);
      });
  };

  const handleDelete = (todoId: number) => {
    setDeletedTodos(prevDeleted => [...prevDeleted, todoId]);

    API.deleteTodo(todoId)
      .then(() => {
        setTodosFromServer(prevTodos =>
          prevTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        setError('Unable to delete a todo');
      })
      .finally(() => {
        setDeletedTodos(prevDeleted => prevDeleted.filter(id => id !== todoId));
        setTimeout(() => {
          inputRef.current?.focus(); // Focus the input field after adding a todo
        }, 0);
      });
  };

  const handleClearCompleted = () => {
    todosFromServer.forEach(todo => {
      if (todo.completed) {
        handleDelete(todo.id);
      }
    });
  };

  const filterTodosByStatus = () => {
    switch (filter) {
      case 'active':
        return todosFromServer.filter(currentTodo => !currentTodo.completed);
      case 'completed':
        return todosFromServer.filter(currentTodo => currentTodo.completed);
      default:
        return todosFromServer;
    }
  };

  const visibleTodos = filterTodosByStatus();
  const completedItems = todosFromServer.filter(todo => todo.completed).length;

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodosHeader
          todos={todosFromServer}
          tempTodo={tempTodo}
          inputValue={inputValue}
          inputRef={inputRef}
          setInputValue={setInputValue}
          onSubmit={handleAdd}
        />
        {todosFromServer.length > 0 && (
          <>
            <TodoList
              todos={visibleTodos}
              tempTodo={tempTodo}
              deletedTodos={deletedTodos}
              onDelete={handleDelete}
            />
            <TodosFooter
              completedItems={completedItems}
              totalItems={todosFromServer.length}
              onFilterChange={handleFilterChange}
              onClearCompleted={handleClearCompleted}
            />
          </>
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <ErrorNotification
        error={error}
        setError={setError}
        onHideError={handleHideError}
      />
    </div>
  );
};
