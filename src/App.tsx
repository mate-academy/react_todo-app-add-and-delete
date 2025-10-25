/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { addTodo, getTodos, removeTodo, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { TodoElement } from './components/TodoElement/TodoElement';
import { UserWarning } from './UserWarning';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import { Error } from './components/Error/Error';
import { FilterStatus } from './types/FilterStatus';
import { ErrorType } from './types/ErrorType';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

export const App: React.FC = () => {
  const todoInput = useRef<HTMLInputElement>(null);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [showedTodos, setShowedTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>(
    FilterStatus.All,
  );
  const [title, setTitle] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<ErrorType>(
    ErrorType.NoError,
  );
  const [currentTodoId, setCurrentTodoId] = useState<number | null>(null);

  const activeTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);
  const itemsLeft = activeTodos.length;

  const handleFocus = () => {
    if (todoInput.current) {
      todoInput.current.focus();
    }
  };

  useEffect(() => {
    switch (filterStatus) {
      case FilterStatus.Active:
        setShowedTodos(activeTodos);
        break;
      case FilterStatus.Completed:
        setShowedTodos(completedTodos);
        break;
      case FilterStatus.All:
      default:
        setShowedTodos(todos);
        break;
    }

    handleFocus();
  }, [filterStatus, todos]);

  const timerId = useRef(0);

  const hideError = () => {
    if (timerId.current) {
      clearTimeout(timerId.current);
    }

    timerId.current = window.setTimeout(() => {
      setErrorMessage(ErrorType.NoError);
    }, 3000);
  };

  useEffect(() => {
    setLoading(true);

    getTodos()
      .then(result => {
        setTodos(result);
        setShowedTodos(result);
      })
      .catch(error => {
        setErrorMessage(ErrorType.LoadTodosError);
        hideError();
        throw error;
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleTodoSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage(ErrorType.NoError);

    if (title.trim().length > 0) {
      setLoading(true);
      setCurrentTodoId(0);
      setTempTodo({
        id: 0,
        userId: USER_ID,
        title: title.trim(),
        completed: false,
      });

      let newTodo: Todo | null = null;

      addTodo(title.trim())
        .then((response: Todo) => {
          newTodo = response;
          setCurrentTodoId(response.id);
        })
        .catch(error => {
          setErrorMessage(ErrorType.AddTodoError);
          hideError();
          throw error;
        })
        .finally(() => {
          setLoading(false);
          if (newTodo) {
            setTodos([...todos, newTodo]);
            setTitle('');
            setCurrentTodoId(null);
          }

          setTempTodo(null);
        });
    } else {
      setErrorMessage(ErrorType.EmptyTodoTitleError);
      hideError();
    }
  };

  const handleTitleChange = (value: string) => {
    setErrorMessage(ErrorType.NoError);
    setTitle(value);
  };

  const handleTodoDelete = (todo: Todo) => {
    setErrorMessage(ErrorType.NoError);
    setLoading(true);
    setTodos(currentTodos => currentTodos.filter(t => t.id !== todo.id));
    setCurrentTodoId(todo.id);

    removeTodo(todo.id)
      .catch(error => {
        setTodos(todos);
        setErrorMessage(ErrorType.DeleteTodoError);
        hideError();
        throw error;
      })
      .finally(() => {
        setLoading(false);
        setCurrentTodoId(null);
        setTimeout(() => {
          handleFocus();
        }, 0);
      });
  };

  const handleCompletedDelete = () => {
    setErrorMessage(ErrorType.NoError);
    setLoading(true);
    const completedIds = completedTodos.map(todo => todo.id);
    const prevTodos = todos;

    Promise.allSettled(completedIds.map(id => removeTodo(id)))
      .then(results => {
        // Check which deletions failed
        const failedIds = results
          .map((result, index) => ({
            result,
            id: completedIds[index],
          }))
          .filter(item => item.result.status === 'rejected')
          .map(item => item.id);

        if (failedIds.length > 0) {
          setErrorMessage(ErrorType.DeleteTodoError);
        }

        setTodos(
          prevTodos.filter(
            todo =>
              !completedIds.includes(todo.id) || failedIds.includes(todo.id),
          ),
        );
        hideError();
      })
      .finally(() => {
        setLoading(false);
        setTimeout(() => {
          handleFocus();
        }, 0);
      });
  };

  useEffect(() => {
    handleFocus();
  }, [errorMessage]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todoInput={todoInput}
          title={title}
          onTodoSubmit={handleTodoSubmit}
          onTitleChange={handleTitleChange}
          loading={loading}
        />

        <section className="todoapp__main" data-cy="TodoList">
          {/* This is a completed todo */}
          <TransitionGroup>
            {showedTodos.map(todo => (
              <CSSTransition key={todo.id} timeout={300} classNames="item">
                <TodoElement
                  key={todo.id}
                  todo={todo}
                  loading={loading}
                  onTodoDelete={handleTodoDelete}
                  currentTodoId={currentTodoId}
                />
              </CSSTransition>
            ))}
            {tempTodo && (
              <CSSTransition key={0} timeout={300} classNames="temp-item">
                <TodoElement
                  key={0}
                  todo={tempTodo}
                  loading={loading}
                  onTodoDelete={handleTodoDelete}
                  currentTodoId={currentTodoId}
                />
              </CSSTransition>
            )}
          </TransitionGroup>
        </section>

        {/* Hide the footer if there are no todos */}
        {todos.length !== 0 && (
          <Footer
            itemsLeft={itemsLeft}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            completedTodos={completedTodos}
            onCompletedDelete={handleCompletedDelete}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <Error
        errorMessage={errorMessage}
        onRemoveError={() => setErrorMessage(ErrorType.NoError)}
      />
    </div>
  );
};
