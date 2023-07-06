import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import { Todo } from './types/Todo';
import { TodoStatus } from './types/TodoStatus';
import { Notification } from './components/Notification/Notification';
import { Todolist } from './components/Todolist/Todolist';
import { getTodos, addTodos, deleteTodo } from './api/todos';
import { ErrorMessage } from './types/ErrorMessage';

const USER_ID = 10897;
// const USER_ID = 10928;
// It`s not real USER_ID, because in case https://mate-academy.github.io/react_todo-app-with-api/ doesn't respond.

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState<TodoStatus>(TodoStatus.ALL);
  const [errorMessage, setErrorMessage]
    = useState<ErrorMessage>(ErrorMessage.NOERROR); // setIsError
  const [isLoading, setIsLoading] = useState(false);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodos, setLoadingTodos] = useState([0]);

  useEffect(() => {
    getTodos(USER_ID)
      .then((loadedTodos: Todo[]) => {
        setTodos(loadedTodos);
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.LOADERROR);
      });
  }, []);

  const handleCloseError = () => {
    setErrorMessage(ErrorMessage.NOERROR);
  };

  const getFilteredTodos = (visibleTodos: Todo[], filter: TodoStatus) => {
    return visibleTodos.filter(todo => {
      switch (filter) {
        case TodoStatus.ACTIVE:
          return todo.completed ? 0 : todo;
        case TodoStatus.COMPLETED:
          return todo.completed ? todo : 0;
        case TodoStatus.ALL:
          return todo;
        default:
          return todo;
      }
    });
  };

  const filteredTodos = getFilteredTodos(todos, filterBy);
  const completedTodos = filteredTodos.filter(todo => todo.completed);
  const activeTodos = filteredTodos.filter(todo => !todo.completed);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsLoading(true);
    setTempTodo({
      id: 0,
      title: newTodoTitle,
      completed: false,
      userId: USER_ID,
    });

    if (!newTodoTitle.trim()) {
      setErrorMessage(ErrorMessage.TITLEERROR);
      setIsLoading(false);
      setTempTodo(null);

      return;
    }

    addTodos(USER_ID, {
      title: newTodoTitle,
      userId: USER_ID,
      completed: false,
    })
      .then((result) => {
        setTodos((prevTodos) => {
          return [result, ...prevTodos];
        });
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.ADDERROR);
      })
      .finally(() => {
        setIsLoading(false);
        setTempTodo(null);
        setNewTodoTitle('');
      });
  };

  const removeTodo = (todoId: number) => {
    setLoadingTodos((prevState) => [...prevState, todoId]);

    deleteTodo(todoId)
      .then(() => {
        setTodos(
          todos.filter(todo => (
            todo.id !== todoId
          )),
        );
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.DELETEERROR);
      })
      .finally(() => {
        setLoadingTodos([0]);
      });
  };

  const handleRemoveCompleted = () => {
    const todoToRemove = completedTodos.map(todo => {
      setLoadingTodos((prevState) => [...prevState, todo.id]);

      return deleteTodo(todo.id);
    });

    Promise.all(todoToRemove)
      .then(() => {
        setTodos(activeTodos);
        setLoadingTodos([0]);
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
          activeTodos={activeTodos}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
          newTodoTitle={newTodoTitle}
          setNewTodoTitle={setNewTodoTitle}
        />

        <Todolist
          todos={todos}
          filteredTodos={tempTodo}
          loadingTodos={loadingTodos}
          deleteTodo={removeTodo} // deleteTodoId
        />

        {todos.length > 0 && (
          <Footer
            activeTodos={activeTodos} // todos
            todoStatus={filterBy} // filter
            setTodoStatus={setFilterBy} // setFilter
            completedTodos={completedTodos}
            handleRemoveCompleted={handleRemoveCompleted}
          />
        )}
      </div>

      {errorMessage && (
        <Notification
          errorMessage={errorMessage}
          handleCloseError={handleCloseError}
        />
      )}
    </div>
  );
};
