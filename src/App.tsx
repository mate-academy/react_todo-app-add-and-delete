import React, { useEffect, useState, useRef } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID, getTodos, deleteTodo, createTodo } from './api/todos';
import { Errors } from './components/errors/errors';
import { Footer } from './components/footer/footer';
import { ToDoList } from './components/todoList/todoList';
import { Header } from './components/header/header';
import { Todo } from './types/Todo';
import { Status } from './types/status';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [status, setStatus] = useState('');
  const [idTodo, setIdTodo] = useState(0);
  const [newTodo, setNewTodo] = useState({
    userId: USER_ID,
    title: '',
    completed: false,
  });

  const errorTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleError = (message: string) => {
    setErrorMessage(message);

    if (errorTimeoutRef.current) {
      clearTimeout(errorTimeoutRef.current);
    }

    errorTimeoutRef.current = setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  };

  useEffect(() => {
    getTodos()
      .then(todosFromServer => {
        switch (status) {
          case Status.active:
            setTodos(todosFromServer.filter(todo => !todo.completed));
            break;

          case Status.completed:
            setTodos(todosFromServer.filter(todo => todo.completed));
            break;

          default:
            setTodos(todosFromServer);
        }
      })
      .catch(() => handleError('Unable to load todos'));
  }, [setTodos, status]);

  function onDeleteTodo(todoId: number) {
    setIdTodo(todoId);

    return deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos => {
          return currentTodos.filter(todo => todo.id !== todoId);
        });
      })
      .catch(() => {
        handleError('Unable to delete a todo');
      });
  }

  function onCreateTodo(newToDo: Omit<Todo, 'id'>) {
    const todoTrim = { ...newToDo, title: newToDo.title.trim() };

    setTodos(currentTodos => [...currentTodos, { ...newTodo, id: 0 }]);
    setIdTodo(0);

    return createTodo(todoTrim)
      .then(todo => {
        setTodos(todos);
        setTodos(currentTodos => [...currentTodos, todo]);
      })
      .catch(error => {
        handleError('Unable to add a todo');
        setTodos(todos);
        throw error;
      });
  }

  function handleChangeTitle(value: string) {
    setNewTodo(currentTodo => ({
      ...currentTodo,
      title: value,
    }));
  }

  function reset() {
    setNewTodo(currentTodo => ({
      ...currentTodo,
      title: '',
    }));
  }

  const leftItems = todos.filter(todo => !todo.completed && todo.id !== 0);
  const completedItems = todos.filter(todo => todo.completed);

  async function clearCompletedTodo() {
    completedItems.map(async todo => {
      await deleteTodo(todo.id)
        .then(() => {
          setTodos(currentTodos => {
            return currentTodos.filter(item => item.id !== todo.id);
          });
        })
        .catch(() => {
          handleError('Unable to delete a todo');
        });
    });
  }

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todo={newTodo}
          onSubmit={onCreateTodo}
          onChange={handleChangeTitle}
          onReset={reset}
          onError={handleError}
        />

        <ToDoList list={todos} onDelete={onDeleteTodo} idTodo={idTodo} />

        {!!todos.length && (
          <Footer
            onClick={setStatus}
            status={status}
            leftItems={leftItems.length}
            completedItems={completedItems}
            onDelete={clearCompletedTodo}
          />
        )}
      </div>

      <Errors errorMessage={errorMessage} onClose={setErrorMessage} />
    </div>
  );
};
