/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, createTodo, removeTodo } from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Filter } from './types/Filter';
import { ErrorAction } from './types/ErrorAction';
import { Notification } from './components/Notification';

const USER_ID = 6655;

function filteredTodos(todos:Todo[], filter:Filter) {
  const returnArr = [...todos];

  switch (filter) {
    case Filter.ACTIVE:
      return returnArr.filter(todo => !todo.completed);
    case Filter.COMPLETED:
      return returnArr.filter(todo => todo.completed);
    default:
      return returnArr;
  }
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState<Filter>(Filter.ALL);
  const [errorMessage, setErrorMessage]
    = useState<ErrorAction>(ErrorAction.NONE);
  const visibleTodos = filteredTodos(todos, filterBy);
  const todosLeft = todos.filter(todoLeft => !todoLeft.completed).length;
  const [tempTodo, setTempTodo] = useState<Todo>();
  const [disabledInput, setDisabledInput] = useState(false);
  const [loadingTodoId, setLoadingTodoId] = useState<number[]>([]);

  useEffect(() => {
    getTodos(USER_ID)
      .then(result => {
        setTodos(result);
      })
      .catch(() => {
        setErrorMessage(ErrorAction.LOAD);
        setTimeout(() => {
          setErrorMessage(ErrorAction.NONE);
        }, 3000);
      });
  }, []);

  const addTodo = (title: string) => {
    setDisabledInput(true);

    const newTodo = {
      title,
      userId: USER_ID,
      completed: false,
    };

    setTempTodo({ ...newTodo, id: 0 });

    createTodo(newTodo)
      .then(result => {
        setTodos(prev => {
          return [
            ...prev,
            result,
          ];
        });
      })
      .catch(() => {
        setErrorMessage(ErrorAction.ADD);
        setTimeout(() => {
          setErrorMessage(ErrorAction.NONE);
        }, 3000);
      })
      .finally(() => {
        setDisabledInput(false);
        setTempTodo(undefined);
      });
  };

  const deleteTodo = (id: number): Promise<void> => {
    return new Promise((resolve, reject) => {
      setLoadingTodoId(prev => [...prev, id]);
      removeTodo(id)
        .then(() => {
          setTodos(todos.filter(todo => todo.id !== id));
          setLoadingTodoId(prev => prev.filter(todoId => todoId !== id));
          resolve();
        })
        .catch(() => {
          setErrorMessage(ErrorAction.DELETE);
          setTimeout(() => {
            setErrorMessage(ErrorAction.NONE);
          }, 3000);
          setLoadingTodoId(prev => prev.filter(todoId => todoId !== id));
          reject();
        });
    });
  };

  const deleteTodoCompleted = () => {
    const completed = todos.filter(todo => todo.completed);
    const uncompleted = todos.filter(todo => !todo.completed);

    completed.forEach(todo => {
      deleteTodo(todo.id)
        .then(() => {
          setTodos(uncompleted);
        });
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
          onSubmit={addTodo}
          isDisabled={disabledInput}
          errorInput={() => {
            setErrorMessage(ErrorAction.TITLE);
            setTimeout(() => {
              setErrorMessage(ErrorAction.NONE);
            }, 3000);
          }}
        />
        <TodoList
          todos={visibleTodos}
          tempTodo={tempTodo}
          deleteTodo={deleteTodo}
          loadingTodoId={loadingTodoId}
        />

        {todos.length > 0 && (
          <Footer
            setFilterBy={setFilterBy}
            filter={filterBy}
            todosLeft={todosLeft}
            deleteTodoCompleted={deleteTodoCompleted}
          />
        )}
      </div>
      <Notification
        errorMessage={errorMessage}
        onClose={() => setErrorMessage(ErrorAction.NONE)}
      />

    </div>
  );
};
