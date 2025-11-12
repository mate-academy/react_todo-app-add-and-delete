/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { deleteTodo, getTodos, postTodo, USER_ID } from './api/todos';
import { TodoList } from './components/TodoList';
import { Todo } from './types/Todo';
import cn from 'classnames';
import { TodoStatus } from './types/TodoStatus';
import { TodoErrors } from './types/TodoErrors';
import { Footer } from './components/Footer';

function getFilteredTodos(
  todos: Todo[],
  { status }: { status: TodoStatus },
): Todo[] {
  let filteredTodos = [...todos];

  switch (status) {
    case TodoStatus.Active:
      filteredTodos = filteredTodos.filter(todo => todo.completed === false);
      break;
    case TodoStatus.Completed:
      filteredTodos = filteredTodos.filter(todo => todo.completed === true);
      break;
    default:
      break;
  }

  return filteredTodos;
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [status, setStatus] = useState(TodoStatus.All);
  const [completedTodos, setCompletedTodos] = useState<Todo[]>([]);
  const [todoTitle, setTodoTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isDisabled, setIsDisabled] = useState(false);
  const [loadingTodos, setLoadingTodos] = useState<Todo['id'][]>([]);

  const inputRef = useRef<HTMLInputElement>(null);

  function showErrorMessageWithAutoHide(errorText: string) {
    setErrorMessage(errorText);

    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  }

  useEffect(() => {
    inputRef.current?.focus();
    getTodos()
      .then(todosFromServer => {
        setTodos(todosFromServer);
        setCompletedTodos(todosFromServer.filter(todo => todo.completed));
      })
      .catch(() => {
        showErrorMessageWithAutoHide(TodoErrors.UnableLoadError);
      });
  }, []);

  const handleStatus = (status: TodoStatus) => {
    switch (status) {
      case TodoStatus.All:
        setStatus(TodoStatus.All);
        break;
      case TodoStatus.Active:
        setStatus(TodoStatus.Active);
        break;
      case TodoStatus.Completed:
        setStatus(TodoStatus.Completed);
        break;
      default:
        break;
    }
  };

  const handleSetTodoTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTodoTitle(event.target.value.trimStart());
    setErrorMessage('');
  };

  useEffect(() => {
    if (!isDisabled) {
      inputRef.current?.focus();
    }
  }, [isDisabled]);

  function handleTodoSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (todoTitle === '') {
      showErrorMessageWithAutoHide(TodoErrors.TitleError);
    }

    if (todoTitle !== '') {
      setIsDisabled(true);
      setTempTodo({
        id: 0,
        userId: USER_ID,
        title: todoTitle.trim(),
        completed: false,
      });
      setLoadingTodos(currentIds => [...currentIds, 0]);

      postTodo({
        id: 0,
        userId: USER_ID,
        title: todoTitle.trim(),
        completed: false,
      })
        .then(todo => {
          setTodos(currentTodos => [...currentTodos, todo]);
          setTodoTitle('');
        })
        .catch(() => {
          showErrorMessageWithAutoHide(TodoErrors.UnableAddError);
        })
        .finally(() => {
          setLoadingTodos(currentTodos => currentTodos.filter(id => id !== 0));
          setTempTodo(null);
          setIsDisabled(false);
        });
    }
  }

  function handleDeleteTodo(todoId: Todo['id']) {
    setLoadingTodos(currentIds => [...currentIds, todoId]);
    setIsDisabled(true);

    deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        showErrorMessageWithAutoHide(TodoErrors.UnableDeleteError);
      })
      .finally(() => {
        setIsDisabled(false);
      });
  }

  function handleDeleteCompletedTodo() {
    const completedTodosIds = completedTodos.map(todo => todo.id);

    setIsDisabled(true);

    setLoadingTodos(currentIds => [...currentIds, ...completedTodosIds]);
    Promise.allSettled(
      completedTodos.map(completedtodo =>
        deleteTodo(completedtodo.id)
          .then(() => {
            setTodos(currentTodos =>
              currentTodos.filter(todo => todo.id !== completedtodo.id),
            );
            setCompletedTodos(currentCompletedTodos =>
              currentCompletedTodos.filter(
                todo => todo.id !== completedtodo.id,
              ),
            );
          })
          .catch(() => {
            showErrorMessageWithAutoHide(TodoErrors.UnableDeleteError);
          })
          .finally(() => {
            setIsDisabled(false);
          }),
      ),
    );
  }

  if (!USER_ID) {
    return <UserWarning />;
  }

  const preparedTodos = getFilteredTodos(todos, { status });

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          <button
            type="button"
            className="todoapp__toggle-all active"
            data-cy="ToggleAllButton"
          />

          {/* Add a todo on form submit */}
          <form onSubmit={handleTodoSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={todoTitle}
              onChange={handleSetTodoTitle}
              disabled={isDisabled}
              ref={inputRef}
            />
          </form>
        </header>

        {todos.length > 0 && (
          <>
            <TodoList
              todos={preparedTodos}
              tempTodo={tempTodo}
              loadingTodos={loadingTodos}
              onLoadingTodos={setLoadingTodos}
              onHandleDeleteTodo={handleDeleteTodo}
            />

            <Footer
              todos={todos}
              completedTodos={completedTodos}
              status={status}
              onHandleStatus={handleStatus}
              onHandleDeleteCompletedTodo={handleDeleteCompletedTodo}
            />
          </>
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: errorMessage === '' },
        )}
      >
        <button data-cy="HideErrorButton" type="button" className="delete" />
        {/* show only one message at a time */}
        {errorMessage}
        {/* <br />
        Title should not be empty
        <br />
        Unable to add a todo
        <br />
        Unable to delete a todo
        <br />
        Unable to update a todo */}
      </div>
    </div>
  );
};
