import React, { FormEvent, useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { addTodo, deleteTodo, getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
// eslint-disable-next-line max-len
import { ErrorNotification } from './components/ErrorNotification/ErrorNotification';

export enum Status {
  all = 'all',
  active = 'active',
  completed = 'completed',
}

function getVisibleTodos(todos: Todo[], status: Status) {
  const copyTodos = [...todos];

  if (status === Status.active) {
    return copyTodos.filter(todo => !todo.completed);
  }

  if (status === Status.completed) {
    return copyTodos.filter(todo => todo.completed);
  }

  return copyTodos;
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [statusTodo, setStatusTodo] = useState<Status>(Status.all);
  const [textField, setTextField] = useState('');
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(0);

  const field = useRef<HTMLInputElement>(null);
  const todosLength = todos.length;
  const completedTodosId = todos
    .filter(todo => todo.completed)
    .map(el => el.id);
  const visibleTodos = getVisibleTodos(todos, statusTodo);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage('Unable to load todos'));
  }, []);

  useEffect(() => {
    field.current?.focus();
  }, [isSubmiting]);

  useEffect(() => {
    window.setTimeout(() => setErrorMessage(''), 3000);
  }, [errorMessage]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleTextField = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTextField(e.target.value);
    setErrorMessage('');
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!textField.trim()) {
      setErrorMessage('Title should not be empty');

      return;
    }

    const newTodo: Omit<Todo, 'id'> = {
      userId: USER_ID,
      title: textField,
      completed: false,
    };

    setIsSubmiting(true);
    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: textField,
      completed: false,
    });

    addTodo(newTodo)
      .then(todo => {
        setTodos(currentTodos => [...currentTodos, todo]);
        setTextField('');
      })
      .catch(error => {
        setErrorMessage('Unable to add a todo');
        throw error;
      })
      .finally(() => {
        setIsSubmiting(false);
        setTempTodo(null);
      });
  };

  const handleDelete = (todoId: number) => {
    setIsLoading(todoId);
    deleteTodo(todoId)
      .then(() =>
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        ),
      )
      .catch(error => {
        setTodos(todos);
        setErrorMessage('Unable to delete a todo');
        throw error;
      })
      .finally(() => setIsLoading(0));
  };

  const handleDeleteCompleted = () => {
    const promises = completedTodosId.map(el => {
      setIsLoading(el);

      return deleteTodo(el)
        .then(() => {
          setTodos(currentTodos => currentTodos.filter(todo => todo.id !== el));
        })
        .catch(error => {
          setTodos(todos);
          setErrorMessage('Unable to delete a todo');
          throw error;
        })
        .finally(() => setIsLoading(0));
    });

    Promise.allSettled(promises); // З
    // completedTodos.forEach(el => )
    //   const el = completedTodos[i];

    //   setIsLoading(el);
    //   deleteTodo(el)
    //     .then(() =>
    //       setTodos(currentTodos => currentTodos.filter(todo => todo.id !== el)),
    //     )
    //     .catch(error => {
    //       setTodos(todos);
    //       setErrorMessage('Unable to delete a todo');
    //       throw error;
    //     })
    //     .finally(() => setIsLoading(0));
    // }
  };
  // maybe i should use allSettled?

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          textField={textField}
          onTextField={handleTextField}
          onSubmit={handleSubmit}
          isSubmiting={isSubmiting}
          field={field}
        />

        <TodoList
          visibleTodos={visibleTodos}
          onDelete={handleDelete}
          isLoading={isLoading}
          tempTodo={tempTodo}
          textField={textField}
        />

        {/* Hide the footer if there are no todos */}
        {!!todosLength && (
          <Footer
            statusTodo={statusTodo}
            todosLength={todosLength}
            completedTodosLength={completedTodosId.length}
            onStatus={setStatusTodo}
            onDeleteCompleted={handleDeleteCompleted}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <ErrorNotification
        errorMessage={errorMessage}
        onError={setErrorMessage}
      />
    </div>
  );
};
