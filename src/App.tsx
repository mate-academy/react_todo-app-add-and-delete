/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import * as todoService from './api/todos';
import { UserWarning } from './UserWarning';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { TodoList } from './components/TodoList';
import { Todo } from './types/Todo';
import { getTodos } from './api/todos';
import { USER_ID } from './utils/fetchClient';
import { Status } from './types/Status';
import { Message } from './types/Message';
import { TodoItem } from './components/TodoItem';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todosStatus, setTodosStatus] = useState<Status>(Status.All);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<Message | ''>('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [titleTodo, setTitleTodo] = useState('');
  const [deletedTodo, setDeletedTodo] = useState<number | null>(null);

  const filterTodos = (listTodos: Todo[], status: Status) => {
    switch (status) {
      case Status.Active:
        return listTodos.filter(todo => !todo.completed);
      case Status.Completed:
        return listTodos.filter(todo => todo.completed);
      case Status.All:
      default:
        return listTodos;
    }
  };

  const visivleTodo = filterTodos(todos, todosStatus);
  const activeTodos = todos.filter(todo => !todo.completed);

  const addTodo = ({ userId, title, completed }: Todo) => {
    setErrorMessage('');
    setIsLoading(true);

    const createdTodo = {
      id: 0,
      userId: USER_ID,
      title: title.trim(),
      completed: false,
    };

    setTempTodo(createdTodo);

    todoService.createTodo({ userId, title, completed })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setTitleTodo('');
      })
      .catch(() => {
        setErrorMessage(Message.NoAddTodo);
      })
      .finally(() => {
        setIsLoading(false);
        setTempTodo(null);
      });
  };

  const removeTodo = (todosId: number[] | null) => {
    setIsLoading(true);

    if (todosId) {
      todosId.map(todoId => {
        setDeletedTodo(todoId);

        return todoService.deleteTodos(todoId)
          .then(() => {
            setTodos(currentTodos => (
              currentTodos.filter(todo => todo.id !== todoId)
            ));
          })
          .catch((error) => {
            setTodos(todos);
            setErrorMessage(Message.NoDeleteTodo);
            throw error;
          })
          .finally(() => {
            setIsLoading(false);
            setDeletedTodo(null);
          });
      });
    }
  };

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => setErrorMessage(Message.NoLoadTotos));
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          setTitleTodo={setTitleTodo}
          titleTodo={titleTodo}
          setErrorMessage={setErrorMessage}
          onAddTodo={addTodo}
          isLoading={isLoading}
          setTodos={setTodos}
          todos={todos}
        />

        {todos.length > 0 && (
          <TodoList
            todos={visivleTodo}
            removeTodo={removeTodo}
            deletedTodo={deletedTodo}
            setTodos={setTodos}
          />
        )}
        {tempTodo && (
          <TodoItem
            todo={tempTodo}
            removeTodo={removeTodo}
            setTodos={setTodos}
            todos={todos}
          />
        )}
        {todos.length > 0 && (
          <Footer
            todosStatus={todosStatus}
            setTodosStatus={setTodosStatus}
            todos={visivleTodo}
            activeTodos={activeTodos}
            removeTodo={removeTodo}
          />
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
