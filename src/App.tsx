/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import classNames from 'classnames';
import { Todo } from './types/Todo';
import { Status } from './types/Status';
import { TypeError } from './types/TypeError';
import { UserWarning } from './UserWarning';
import { TodoAppHeader } from './components/TodoAppHeader';
import { TodoAppTodo } from './components/TodoAppTodo';
import { TodoAppFooter } from './components/TodoAppFooter';
import { getTodos, createTodo, deleteTodo } from './api/todos';

const USER_ID = 6270;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [typeError, setTypeError] = useState('');
  const [textError, setTextError] = useState('');
  const [filterByStatus, setFilterByStatus] = useState(Status.All);
  const [disableInput, setDisableInput] = useState(false);
  const [idTodosLoading, setIdTodosLoading] = useState<number[]>([]);
  const [titleTodo, setTitleTodo] = useState('');

  const activeTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);
  const areAllTodosCompleted = todos.every(todo => todo.completed);
  let visibleTodos;

  const deleteHandler = (todoId?: number) => {
    setTypeError('');
    const todoIdsForDeleting = todoId
      ? [todoId]
      : completedTodos.map(todo => todo.id);

    setIdTodosLoading(todoIdsForDeleting);
    const clearingTodos = todoIdsForDeleting.map(id => deleteTodo(id));

    Promise.all(clearingTodos)
      .then(() => {
        setTodos(todoId
          ? todos.filter(todo => todo.id !== todoId)
          : [...activeTodos]);
      })
      .catch(() => {
        setTypeError(TypeError.Delete);
        setTextError(TypeError.Delete);
      })
      .finally(() => {
        setIdTodosLoading([]);
      });
  };

  const addHandler = () => {
    if (!titleTodo) {
      setTypeError(TypeError.TitleIsEmpty);
      setTextError(TypeError.TitleIsEmpty);

      return;
    }

    const data = {
      userId: USER_ID,
      title: titleTodo,
      completed: false,
    };

    setTypeError('');
    setDisableInput(true);
    setTempTodo({ ...data, id: 0 });

    createTodo(data)
      .then((addedTodo) => {
        setTempTodo(null);
        setTodos([...todos, addedTodo]);
        setTitleTodo('');
      })
      .catch(() => {
        setTypeError(TypeError.Add);
        setTextError(TypeError.Add);
      })
      .finally(() => setDisableInput(false));
  };

  useEffect(() => {
    getTodos(USER_ID)
      .then(loadedTodos => setTodos(loadedTodos))
      .catch(() => {
        setTypeError(TypeError.Unexpected);
        setTextError(TypeError.Unexpected);
      });
  }, []);

  useEffect(() => {
    const timerId = setTimeout(setTypeError, 3000, '');

    return () => clearTimeout(timerId);
  }, [typeError]);

  switch (filterByStatus) {
    case Status.Active:
      visibleTodos = activeTodos;
      break;

    case Status.Completed:
      visibleTodos = completedTodos;
      break;

    default:
      visibleTodos = todos;
      break;
  }

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoAppHeader
          allTodosCompleted={areAllTodosCompleted}
          disableInput={disableInput}
          titleTodo={titleTodo}
          setTitleTodo={setTitleTodo}
          addHandler={addHandler}
        />

        {todos.length > 0 && (
          <>
            <section className="todoapp__main">
              <TransitionGroup>
                {visibleTodos.map(todo => (
                  <CSSTransition
                    key={todo.id}
                    timeout={500}
                    classNames="item"
                  >
                    <TodoAppTodo
                      todo={todo}
                      deleteHandler={deleteHandler}
                      isProcessed={idTodosLoading.includes(todo.id)}
                    />
                  </CSSTransition>
                ))}
                {tempTodo && (
                  <CSSTransition
                    key={0}
                    timeout={500}
                    classNames="temp-item"
                  >
                    <TodoAppTodo
                      todo={tempTodo}
                      isProcessed
                    />
                  </CSSTransition>
                )}
              </TransitionGroup>
            </section>

            <TodoAppFooter
              itemsLeft={activeTodos.length}
              filterByStatus={filterByStatus}
              setFilterByStatus={setFilterByStatus}
              areTodosCompleted={completedTodos.length > 0}
              clearCompleted={deleteHandler}
            />
          </>
        )}
      </div>

      <div
        className={classNames(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          { hidden: typeError.length === 0 },
        )}
      >
        <button
          type="button"
          className="delete"
          onClick={() => setTypeError('')}
        />
        {textError}
      </div>
    </div>
  );
};
