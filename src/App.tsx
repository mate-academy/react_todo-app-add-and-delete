/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';

import { Todo } from './types/Todo';
import * as todoService from './api/todos';
import { TodoRow } from './components/TodoRow';
import { TodoHeader } from './components/TodoHeader';
import { Status } from './types/Status';
import { TodoFilter } from './components/TodoFilter';

const filterTodos = (todos: Todo[], isCompleted: Status): Todo[] => {
  return todos.filter((todo: Todo) => {
    switch (isCompleted) {
      case Status.Completed:
        return todo.completed;
      case Status.Active:
        return !todo.completed;
      default:
        return true;
    }
  });
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [processingTodoIds, setProcessingTodoIds] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [status, setStatus] = useState<Status>(Status.All);

  useEffect(() => {
    todoService
      .getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
      });
  }, []);

  const timerId = useRef<number>(0);

  useEffect(() => {
    if (timerId.current) {
      window.clearTimeout(timerId.current);
    }

    timerId.current = window.setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  }, [errorMessage]);

  const handleAddTodo = (todoTitle: string) => {
    setTempTodo({
      id: 0,
      title: todoTitle,
      userId: 0,
      completed: false,
    });

    return todoService
      .addTodos(todoTitle)
      .then((newTodo) => {
        setTodos((prevTodos) => [...prevTodos, newTodo]);
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
        throw new Error();
      })
      .finally(() => {
        setTempTodo(null);
      });
  };

  const handleDeleteTodo = (todoId: number) => {
    setProcessingTodoIds(prevTodoIds => [...prevTodoIds, todoId]);

    todoService
      .deleteTodos(todoId)
      .then((() => {
        setTodos((prevTodos) => prevTodos.filter(todo => todo.id !== todoId));
      }))
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
      })
      .finally(() => {
        setProcessingTodoIds(prevTodoIds => prevTodoIds
          .filter(id => id !== todoId));
      });
  };

  const handleRenameTodo = (todo: Todo, newTodoTitle: string) => {
    setProcessingTodoIds(prevTodoids => [...prevTodoids, todo.id]);

    todoService
      .updateTodo({
        id: todo.id,
        title: newTodoTitle,
        userId: todo.userId,
        completed: todo.completed,
      })
      .then(updatedTodo => {
        setTodos(prevState => prevState.map(currentTodo => {
          return currentTodo.id !== updatedTodo.id ? currentTodo : updatedTodo;
        }));
      })
      .catch(() => {
        setErrorMessage('Unable to update a todo');
      })
      .finally(() => {
        setProcessingTodoIds(prevTodoIds => prevTodoIds
          .filter(id => id !== todo.id));
      });
  };

  const handleChangeStatusTodo = (todo: Todo) => {
    setProcessingTodoIds(prevTodoids => [...prevTodoids, todo.id]);

    todoService
      .updateTodo({
        id: todo.id,
        title: todo.title,
        userId: todo.userId,
        completed: !todo.completed,
      })
      .then(updatedTodo => {
        setTodos(prevState => prevState.map(currentTodo => {
          return currentTodo.id !== updatedTodo.id ? currentTodo : updatedTodo;
        }));
      })
      .catch(() => {
        setErrorMessage('Unable to update a todo');
      })
      .finally(() => {
        setProcessingTodoIds(prevTodoIds => prevTodoIds
          .filter(id => id !== todo.id));
      });
  };

  const handleClearCompletedTodos = () => {
    todos
      .filter(todo => todo.completed)
      .forEach(todo => {
        handleDeleteTodo(todo.id);
      });
  };

  const visibleTodos = filterTodos(todos, status);
  const handleFilterStatus = (todosFilter: Status) => (
    setStatus(todosFilter));

  const allTodosCount = todos.length;
  const CompletedTodosCount = todos
    .filter(todo => todo.completed === true).length;
  const isAllTodosCompleted = allTodosCount === CompletedTodosCount;

  const handleChangeStatusTodos = () => {
    if (isAllTodosCompleted) {
      todos
        .forEach(todo => {
          handleChangeStatusTodo(todo);
        });
    } else {
      todos
        .filter(todo => todo.completed === false)
        .forEach(todo => {
          handleChangeStatusTodo(todo);
        });
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          onTodoAdd={handleAddTodo}
          onTodoAddError={setErrorMessage}
          isAllTodosCompleted={isAllTodosCompleted}
          onTodosChangeStatus={handleChangeStatusTodos}
          todos={visibleTodos}
          isTodosHere={Boolean(allTodosCount)}
        />

        <section className="todoapp__main" data-cy="TodoList">
          {visibleTodos.map(todo => {
            return (
              <TodoRow
                todo={todo}
                key={todo.id}
                onTodoDelete={() => handleDeleteTodo(todo.id)}
                onTodoRename={(todoTitle) => handleRenameTodo(todo, todoTitle)}
                onTodoChangeStatus={() => handleChangeStatusTodo(todo)}
                isProcessing={processingTodoIds.includes(todo.id)}
              />
            );
          })}

          {tempTodo && (
            <TodoRow
              todo={tempTodo}
              isProcessing
            />
          )}
        </section>
        {Boolean(todos.length) && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {`${todos.length - CompletedTodosCount} items left`}
            </span>

            <TodoFilter
              handleFilterStatus={handleFilterStatus}
              todosFilterStatus={status}
            />

            <button
              type="button"
              className="todoapp__clear-completed"
              disabled={!CompletedTodosCount}
              data-cy="ClearCompletedButton"
              onClick={handleClearCompletedTodos}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal', {
            hidden: !errorMessage,
          },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => {
            setErrorMessage('');
          }}
        />
        {errorMessage}
      </div>
    </div>
  );
};
