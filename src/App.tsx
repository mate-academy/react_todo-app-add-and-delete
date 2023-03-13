/* eslint-disable jsx-a11y/control-has-associated-label */
import { FC, useEffect, useState } from 'react';
import { addTodo, getTodos, removeTodo } from './api/todos';
import { Notification } from './components/Notification';
import { ErrorMessage } from './types/ErrorMessage';
import { TodoList } from './components/TodoList';
import { Todo } from './types/Todo';
import { Header } from './components/Header';

const USER_ID = 6648;

export const App: FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isInputDisabled, disableInput] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo>();
  const [loadingTodosIDs, setLoadingTodosIDs] = useState<number[]>([]);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState<ErrorMessage>(ErrorMessage.NONE);

  useEffect(() => {
    getTodos(USER_ID)
      .then(result => {
        setTodos(result);
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.LOAD);
        setTimeout(() => {
          setErrorMessage(ErrorMessage.NONE);
        }, 3000);
      });
  }, []);

  const postTodo = (title: string) => {
    disableInput(true);

    const newTodo = {
      title,
      userId: USER_ID,
      completed: false,
    };

    setTempTodo({
      ...newTodo,
      id: 0,
    });

    addTodo(newTodo)
      .then(result => {
        setTodos(prev => {
          return [
            ...prev,
            result,
          ];
        });
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.ADD);
        setTimeout(() => {
          setErrorMessage(ErrorMessage.NONE);
        }, 3000);
      })
      .finally(() => {
        disableInput(false);
        setTempTodo(undefined);
      });
  };

  const deleteTodo = (id: number) => {
    setLoadingTodosIDs(prevState => [...prevState, id]);

    return removeTodo(id)
      .then(() => {
        const newTodosList = todos.filter(todo => todo.id !== id);

        setTodos(newTodosList);
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.DELETE);
        setTimeout(() => {
          setErrorMessage(ErrorMessage.NONE);
        }, 3000);
      })
      .finally(() => {
        setLoadingTodosIDs([]);
      });
  };

  const deleteCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);
    const uncompletedTodos = todos.filter(todo => !todo.completed);

    completedTodos.forEach(todo => {
      deleteTodo(todo.id)
        .then(() => {
          setTodos(uncompletedTodos);
        });
    });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          onEmptyQuery={() => {
            setErrorMessage(ErrorMessage.EMPTY_TITLE);
            setTimeout(() => {
              setErrorMessage(ErrorMessage.NONE);
            }, 3000);
          }}
          onSubmit={postTodo}
          isDisabled={isInputDisabled}
        />

        {todos && todos?.length > 0 && (
          <TodoList
            todos={todos}
            tempTodo={tempTodo}
            onDelete={deleteTodo}
            onClearAll={deleteCompleted}
            loadingTodosIDs={loadingTodosIDs}
          />
        )}
      </div>

      <Notification
        message={errorMessage}
        onClose={() => setErrorMessage(ErrorMessage.NONE)}
      />

    </div>
  );
};
