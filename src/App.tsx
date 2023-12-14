/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect, useRef } from 'react';
import cn from 'classnames';
import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import * as postServices from './api/todos';
import { Todos } from './api/components/todos';
import { Footer } from './api/components/footer';
import { Error } from './api/components/error';
import { Loader } from './api/components/loader';

const USER_ID = 12030;

function getPreparedTodos(todos: Todo[], filter: string): Todo[] {
  const preparedTodos = todos.filter(todo => {
    switch (filter) {
      case 'completed':
        return todo.completed;

      case 'active':
        return !todo.completed;

      default:
        return true;
    }
  });

  return preparedTodos;
}

function todosCounter(todos: Todo[]) {
  return todos.filter(todo => !todo.completed).length;
}

export const App: React.FC = () => {
  const [isloading, setIsloading] = useState(false);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [newTodoodoTitle, setNewTodoTitle] = useState('');
  const [filter, setFilter] = useState('all');
  const [inputDisabled, setInputDisabled] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletedPostsIds, setdeletedPostsIds] = useState<number[]>([]);

  function loadTodos() {
    setIsloading(true);

    return postServices.getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
        setTimeout(() => setErrorMessage(''), 3000);
      })
      .finally(() => setIsloading(false));
  }

  const inputField = useRef<HTMLInputElement>(null);

  if (inputField.current) {
    inputField.current.focus();
  }

  useEffect(() => {
    loadTodos();
    if (inputField.current) {
      inputField.current.focus();
    }
  }, [tempTodo]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const deleteTodo = (postId: number) => {
    setdeletedPostsIds(curId => [...curId, postId]);
    postServices.deleteTodo(postId)
      .then(() => {
        setTodos(curTodos => curTodos.filter(t => t.id !== postId));
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
        setTimeout(() => setErrorMessage(''), 3000);
        setTimeout(() => setdeletedPostsIds([]), 3000);
      });
  };

  const deleteAll = () => {
    todos.filter(t => t.completed)
      .map((todo) => deleteTodo(todo.id));
  };

  function addTodos({ userId, title, completed }: Todo) {
    if (!title.length) {
      setErrorMessage('Title should not be empty');
      setTimeout(() => setErrorMessage(''), 3000);

      return;
    }

    setInputDisabled(true);

    postServices.addTodo({ userId, title, completed })
      .then(nTodo => {
        setTodos((curTodos) => [...curTodos, nTodo]);
        setNewTodoTitle('');
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
        setTimeout(() => setErrorMessage(''), 3000);
      })
      .finally(() => {
        setInputDisabled(false);
        setTempTodo(null);
      });
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const newTodo = {
      id: 0,
      userId: USER_ID,
      title: newTodoodoTitle.trim(),
      completed: false,
    };

    setTempTodo(newTodo);
    addTodos(newTodo);
  };

  const visibleTodos = getPreparedTodos(todos, filter);
  const onFilter = (f: string) => {
    setFilter(f);
  };

  const onCloseError = (e: string) => {
    setErrorMessage(e);
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div
        className="todoapp__content"
      >
        <header className="todoapp__header">
          <button
            type="button"
            className={cn({
              active: visibleTodos.some(t => !t.completed),
            }, 'todoapp__toggle-all')}
            data-cy="ToggleAllButton"
          />

          <form
            onSubmit={handleSubmit}
          >
            <input
              data-cy="newTodoodoTitleField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={newTodoodoTitle}
              onChange={(event) => setNewTodoTitle(event.target.value)}
              ref={inputField}
              disabled={inputDisabled}
            />
          </form>
        </header>

        <section
          className="todoapp__main"
          data-cy="TodoList"
          hidden={isloading}
        >
          <TransitionGroup>
            {visibleTodos.map(todo => (
              <CSSTransition
                key={todo.id}
                timeout={300}
                classNames="item"
              >
                <Todos
                  todo={todo}
                  key={todo.id}
                  onDelete={deleteTodo}
                  deletedPostsIds={deletedPostsIds}
                />
              </CSSTransition>
            ))}

            {tempTodo && (
              <CSSTransition
                key={tempTodo.id}
                timeout={300}
                classNames="item"
              >
                <div
                  data-cy="Todo"
                  className={cn({
                    completed: tempTodo.completed,
                  }, 'todo')}
                >
                  <label className="todo__status-label">
                    <input
                      data-cy="TodoStatus"
                      type="checkbox"
                      className="todo__status"
                    />
                  </label>

                  <span data-cy="TodoTitle" className="todo__title">
                    {tempTodo.title}
                  </span>
                  <Loader />
                </div>
              </CSSTransition>
            )}
          </TransitionGroup>
        </section>

        {todos.length !== 0 && (
          <Footer
            filter={filter}
            onFilter={onFilter}
            count={todosCounter(todos)}
            showCCButton={!visibleTodos.some(todo => todo.completed)}
            deleteAll={deleteAll}
          />
        )}
      </div>

      <Error
        errorMessage={errorMessage}
        onCloseError={onCloseError}
      />
    </div>
  );
};
