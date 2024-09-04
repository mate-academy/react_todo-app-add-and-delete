/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { USER_ID, getTodos, createTodo, onDelete } from './api/todos';
import { Todo } from './types/Todo';
import { Status } from './types/Status';
import { Header } from './components/Header';
import { Error } from './components/ErrorMessage';
import { Footer } from './components/Footer';
import { UserWarning } from './UserWarning';
import { TodoList } from './components/TodoList';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [status, setStatus] = useState(Status.All);
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage('Unable to load todos'));
  }, []);

  function getVisibleTodos(newTodos: Todo[], newStatus: Status) {
    switch (newStatus) {
      case Status.Active:
        return newTodos.filter(todo => !todo.completed);

      case Status.Completed:
        return newTodos.filter(todo => todo.completed);

      default:
        return newTodos;
    }
  }

  const visibleTodos = getVisibleTodos(todos, status);

  const addTodo = (todoTitle: string) => {
    const newTitle = todoTitle.trim();

    if (!newTitle) {
      setErrorMessage('Title should not be empty');

      return;
    }

    setIsLoading(true);

    const newTodo = {
      id: 0,
      title: newTitle,
      completed: false,
      userId: USER_ID,
    };

    setTempTodo(newTodo);

    createTodo(newTodo)
      .then(resultTodo => {
        setTodos([...todos, resultTodo]);
        setTitle('');
      })
      .catch(() => setErrorMessage('Unable to add a todo'))
      .finally(() => {
        setTempTodo(null);
        setIsLoading(false);
      });
  };

  const deleteTodo = (id: number) => {
    setIsLoading(true);

    return onDelete(id)
      .then(() => {
        setTodos(todoState => todoState.filter(todo => todo.id !== id));
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const deleteCompletedTodo = () => {
    setIsLoading(true);

    const completedTodos = todos.filter(item => item.completed);

    completedTodos.forEach(todo => deleteTodo(todo.id));
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          addTodo={addTodo}
          title={title}
          setTitle={setTitle}
          isLoading={isLoading}
        />

        <TodoList
          visibleTodos={visibleTodos}
          deleteTodo={deleteTodo}
          tempTodo={tempTodo}
        />

        {!!todos.length && (
          <Footer
            todos={todos}
            status={status}
            setStatus={setStatus}
            deleteCompletedTodo={deleteCompletedTodo}
          />
        )}
      </div>

      <Error errorMessage={errorMessage} setErrorMessage={setErrorMessage} />
    </div>
  );
};
