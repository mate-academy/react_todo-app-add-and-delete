import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import cn from 'classnames';
import { deleteTodo, addTodo, getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';

import { FilterType } from './types/FilterType';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorMessageType } from './types/ErrorMessageType';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoItem } from './components/TodoItem';

export const App: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [query, setQuery] = useState<FilterType>(FilterType.All);
  const [selectedTitle, setSelectedTitle] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [selected, setSelected] = useState<number | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [deletingTodosId, setDeletingTodosId] = useState<number[]>([]);
  const [errorMessage, setErrorMessage] = useState<ErrorMessageType>(
    ErrorMessageType.NONE,
  );

  const completedTodo = todos.filter(todo => todo.completed);
  const notCompletedTodosCount = todos.filter(todo => !todo.completed).length;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setErrorMessage(ErrorMessageType.TITLE);
      setTitle('');
      inputRef.current?.focus();
      setIsSubmitting(false);

      return;
    }

    setIsSubmitting(true);
    const newTodo = {
      completed: false,
      title: trimmedTitle,
      userId: USER_ID,
    };

    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    });

    setTitle(trimmedTitle);

    addTodo(newTodo)
      .then(TodoToAdd => {
        setTodos(prev => [...prev, TodoToAdd]);
        setTempTodo(null);
        setTitle('');
      })
      .catch(() => {
        setTempTodo(null);
        setErrorMessage(ErrorMessageType.ADD);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const deleteTodoHandler = (id: number) => {
    setDeletingTodosId(prev => [...prev, id]);

    deleteTodo(id)
      .then(() => {
        setTodos(prev => [...prev.filter(todo => todo.id !== id)]);
      })
      .catch(() => {
        setErrorMessage(ErrorMessageType.DELETE);
      })
      .finally(() => setDeletingTodosId([]));
  };

  const handleDoubleClick = (todo: Todo) => {
    setSelectedTitle(todo.title);
    setSelected(todo.id);
  };

  const clearCompleted = () => {
    const ids = completedTodo.map(todo => todo.id);

    setDeletingTodosId(prev => [...prev, ...ids]);

    async function deleteTodosAsync() {
      const promises = ids.map(i => deleteTodo(i));

      setIsSubmitting(true);

      try {
        const results = await Promise.allSettled(promises);

        const successIds: number[] = [];
        const failedIds: number[] = [];

        results.forEach((res, i) =>
          res.status === 'fulfilled'
            ? successIds.push(ids[i])
            : failedIds.push(ids[i]),
        );

        if (failedIds.length > 0) {
          setErrorMessage(ErrorMessageType.DELETE);
        }

        setTodos(prev => prev.filter(todo => !successIds.includes(todo.id)));
      } catch {
        setErrorMessage(ErrorMessageType.DELETE);
      } finally {
        setDeletingTodosId([]);
        setIsSubmitting(false);
      }
    }

    deleteTodosAsync();
  };

  useEffect(() => {
    setTimeout(() => {
      setErrorMessage(ErrorMessageType.NONE);
    }, 3000);
  }, [errorMessage]);

  const visibleTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (query) {
        case FilterType.Active:
          return !todo.completed;
        case FilterType.Completed:
          return todo.completed;
        default:
          return true;
      }
    });
  }, [todos, query]);

  useEffect(() => {
    setLoading(true);
    setErrorMessage(ErrorMessageType.NONE);

    async function fetchTodos() {
      try {
        const todosFromServer = await getTodos();

        setTodos(todosFromServer);
      } catch {
        setErrorMessage(ErrorMessageType.LOAD);
      } finally {
        setLoading(false);
      }
    }

    fetchTodos();
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header
          title={title}
          handleSubmit={handleSubmit}
          handleTitleChange={setTitle}
          notCompletedTodosCount={notCompletedTodosCount}
          isSubmitting={isSubmitting}
          loading={loading}
          inputRef={inputRef}
        />
        <TodoList
          todos={visibleTodos}
          loading={loading}
          selected={selected}
          handleDoubleClick={handleDoubleClick}
          isSubmitting={isSubmitting}
          selectedTitle={selectedTitle}
          setSelectedTitle={setSelectedTitle}
          deleteTodoHandler={deleteTodoHandler}
          deletingTodosId={deletingTodosId}
        ></TodoList>

        {tempTodo && (
          <>
            <div
              data-cy="TodoLoader"
              className={cn('modal overlay', {
                'is-active': false,
              })}
            >
              {/* eslint-disable-next-line max-len */}
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
            <TodoItem
              key={tempTodo.id}
              todo={tempTodo}
              selected={selected}
              handleDoubleClick={handleDoubleClick}
              selectedTitle={selectedTitle}
              setSelectedTitle={setSelectedTitle}
              isSubmitting={isSubmitting}
              deleteTodoHandler={deleteTodoHandler}
              deletingTodosId={deletingTodosId}
            ></TodoItem>
          </>
        )}

        {todos.length && (
          <Footer
            notCompletedTodosCount={notCompletedTodosCount}
            query={query}
            setQuery={setQuery}
            clearCompleted={clearCompleted}
            completedTodoLength={completedTodo.length}
          ></Footer>
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      ></ErrorNotification>
    </div>
  );
};
