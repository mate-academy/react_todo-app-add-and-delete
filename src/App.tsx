import { FormEvent, useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { deleteTodo, addTodo, getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';

import { QueryType } from './types/QueryType';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorMessageType } from './types/ErrorMessageType';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoItem } from './components/TodoItem';

export const App: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [query, setQuery] = useState<QueryType>(QueryType.All);
  const [selectedTitle, setSelectedTitle] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [visibleTodos, setVisibleTodos] = useState<Todo[]>(todos);
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

  function addOptimisticTodo(trimmedTitle: string) {
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

    return newTodo;
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setErrorMessage(ErrorMessageType.TITLE);
      setTitle('');
      inputRef.current?.focus();
      setIsSubmitting(false);
      setTimeout(() => {
        setErrorMessage(ErrorMessageType.NONE);
      }, 3000);

      return;
    }

    setIsSubmitting(true);
    const newTodo = addOptimisticTodo(trimmedTitle);

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
        setTimeout(() => {
          setErrorMessage(ErrorMessageType.NONE);
        }, 3000);
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
        setTimeout(() => {
          setErrorMessage(ErrorMessageType.NONE);
        }, 3000);
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

      try {
        const results = await Promise.allSettled(promises);

        const successIds: number[] = [];
        const failedIds: number[] = [];

        results.forEach((res, i) =>
          res.status === 'fulfilled'
            ? successIds.push(ids[i])
            : failedIds.push(ids[i]),
        );
        setTodos(prev => prev.filter(todo => !successIds.includes(todo.id)));
      } catch {
        setErrorMessage(ErrorMessageType.DELETE);
        setTimeout(() => {
          setErrorMessage(ErrorMessageType.NONE);
        }, 3000);
      } finally {
        setDeletingTodosId([]);
      }
    }

    deleteTodosAsync();
  };

  useEffect(() => {
    const filterTodos = (todosArg: Todo[], queryArg: QueryType) => {
      setVisibleTodos(() =>
        todosArg.filter(todo => {
          switch (queryArg) {
            case QueryType.Active:
              return !todo.completed;
            case QueryType.Completed:
              return todo.completed;
          }

          return todos;
        }),
      );
    };

    filterTodos(todos, query);
  }, [query, todos]);

  useEffect(() => {
    setLoading(true);
    setErrorMessage(ErrorMessageType.NONE);

    async function fetchTodos() {
      try {
        const todosFromServer = await getTodos();

        setTodos(todosFromServer);
      } catch {
        setErrorMessage(ErrorMessageType.LOAD);
        setTimeout(() => {
          setErrorMessage(ErrorMessageType.NONE);
        }, 3000);
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

        {tempTodo !== null && (
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
