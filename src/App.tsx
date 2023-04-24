/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { TodoStatus } from './types/TodoStatus';
import { ErrorMessage } from './types/ErrorMessage';
import {
  getTodos, USER_ID, createTodo, removeTodo,
} from './api/todos';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';

const getVisibleTodos = (todos: Todo[], filterBy: TodoStatus) => {
  let filteredTodos = todos;

  switch (filterBy) {
    case TodoStatus.ACTIVE:
      filteredTodos = todos.filter(item => !item.completed);
      break;
    case TodoStatus.COMPLETED:
      filteredTodos = todos.filter(item => item.completed);
      break;
    case TodoStatus.ALL:
    default:
      break;
  }

  return filteredTodos;
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todoStatus, setTodoStatus] = useState<TodoStatus>(TodoStatus.ALL);
  const [hasError, setHasError] = useState<ErrorMessage>(ErrorMessage.NONE);
  const [isDisabled, setIsDisabled] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [deletedTodoId, setDeletedTodoId] = useState([0]);

  const notCompletedTodo = todos.filter(todo => !todo.completed).length;
  const completedTodo = todos.filter(todo => todo.completed).length;

  useEffect(() => {
    getTodos(USER_ID)
      .then((res) => {
        setTodos(res);
      })
      .catch(() => {
        setHasError(ErrorMessage.LOAD);
      });
  }, []);

  const addTodo = (title: string) => {
    if (!title.trim()) {
      setHasError(ErrorMessage.ADD);
    } else {
      const newTodo = {
        id: 0,
        userId: USER_ID,
        title,
        completed: false,
      };

      setTempTodo(newTodo);
      setIsDisabled(true);

      createTodo(USER_ID, newTodo)
        .then((res) => {
          setTodos((prevTodo) => {
            return [...prevTodo, res];
          });
        })
        .catch(() => {
          setHasError(ErrorMessage.ADD);
        })
        .finally(() => {
          setIsDisabled(false);
          setTempTodo(null);
        });
    }
  };

  const deleteTodo = (id: number) => {
    setDeletedTodoId(prevState => [...prevState, id]);

    removeTodo(id)
      .then(() => {
        const result = todos.filter(todo => todo.id !== id);

        setTodos(result);
      })
      .catch(() => {
        setHasError(ErrorMessage.DELETE);
      })
      .finally(() => {
        setDeletedTodoId([]);
      });
  };

  const handleChangeCompleted = (todoId: number) => {
    setTodos(prevState => prevState.map(todo => (
      todo.id === todoId
        ? {
          ...todo,
          completed: !todo.completed,
        }
        : todo
    )));
  };

  const handleClearCompleted = () => {
    const filteredTodos = todos.filter(todo => !todo.completed);
    const completedTodos = todos.filter(todo => todo.completed);

    const promises = completedTodos.map(todo => {
      setDeletedTodoId(prevState => [...prevState, todo.id]);

      return removeTodo(todo.id);
    });

    Promise.all(promises).then(() => {
      setTodos(filteredTodos);
      setDeletedTodoId([]);
    });
  };

  const handleToggleAll = () => {
    setIsActive(!isActive);
  };

  const onCloseError = () => setHasError(ErrorMessage.NONE);

  useEffect(() => {
    const result = todos.map(item => {
      return { ...item, completed: isActive };
    });

    setTodos(result);
  }, [isActive]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const visibleTodos = getVisibleTodos(todos, todoStatus);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          addTodo={addTodo}
          isDisabled={isDisabled}
          notCompletedTodo={notCompletedTodo}
          onToggleAll={handleToggleAll}
        />

        <TodoList
          todos={visibleTodos}
          onDelete={deleteTodo}
          onChangeCompleted={handleChangeCompleted}
          tempTodo={tempTodo}
          deletedTodoId={deletedTodoId}
        />

        {todos.length > 0 && (
          <>
            <Footer
              todoStatus={todoStatus}
              setTodoStatus={setTodoStatus}
              onClearCompleted={handleClearCompleted}
              notCompletedTodo={notCompletedTodo}
              completedTodo={completedTodo}
            />
          </>
        )}
      </div>

      {hasError && (
        <ErrorNotification
          errorMessage={hasError}
          onCloseError={onCloseError}
        />
      )}
    </div>
  );
};
