import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Status, Todo } from './types/Todo';
import * as postService from './api/todos';
import { getFilteredTodos } from './utils/functions';
import { TodoItem } from './components/TodoItem';
import { TodoFilter } from './components/TodoFilter';
import { Header } from './components/Header';
import { ErrorMessage } from './components/ErrorMessage';
import { TempTodo } from './components/TempTodo';

const USER_ID = 11457;
const initialTodos: Todo[] = [];

export const App: React.FC = () => {
  const [todoList, setTodoList] = useState<Todo[]>(initialTodos);
  const [filterBy, setFilterBy] = useState(Status.All);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [title, setTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingId, setLoadingId] = useState<number[]>([]);

  const filteredTodos = getFilteredTodos(todoList, filterBy);

  useEffect(() => {
    postService.getTodos(USER_ID)
      .then(setTodoList)
      .catch(() => {
        setErrorMessage('Unable to load todos');
      });
    const timerId = setInterval(() => {
      setErrorMessage('');
    }, 3000);

    return () => {
      clearInterval(timerId);
    };
  }, []);

  const activeTodosCount = todoList
    .filter(({ completed }) => completed === false).length;

  const hasCompletedTodosCount = todoList
    .some(({ completed }) => completed === true);

  const deleteTodo = (todoId: number) => {
    setLoadingId([todoId]);

    return postService.deleteTodo(todoId)
      .then(() => {
        setTodoList(currentList => currentList
          .filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
      })
      .finally(() => {
        setLoadingId([]);
      });
  };

  const clearCompleted = () => {
    const completedTodosId = todoList
      .filter(({ completed }) => completed === true)
      .map(({ id }) => id);

    setLoadingId(completedTodosId);

    Promise.all(completedTodosId.map(id => deleteTodo(id)))
      .then(() => {
        setTodoList(currentList => currentList
          .filter(({ completed }) => !completed));
        setLoadingId([]);
      });
  };

  const addNewTodo = (todo: Todo) => {
    setErrorMessage('');
    setLoadingId([0]);
    setTempTodo({
      id: 0,
      userId: USER_ID,
      title,
      completed: false,
    });

    postService.createTodo(todo)
      .then(newTodo => {
        setTodoList(currentTodos => [...currentTodos, newTodo]);
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
      })
      .finally(() => {
        if (!errorMessage) {
          setTitle('');
        }

        setTempTodo(null);
        setLoadingId([]);
      });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      setErrorMessage('Title should not be empty');

      return;
    }

    addNewTodo({
      id: +new Date(),
      userId: USER_ID,
      title,
      completed: false,
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
          activeTodosCount={activeTodosCount}
          handleSubmit={handleSubmit}
          loadingId={loadingId}
          title={title}
          setTitle={setTitle}
        />

        <section className="todoapp__main" data-cy="TodoList">
          {filteredTodos && (
            filteredTodos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                deleteTodo={deleteTodo}
                loadingId={loadingId}
              />
            ))
          )}
        </section>

        {tempTodo !== null && (
          <TempTodo tempTodo={tempTodo} />
        )}

        {todoList.length !== 0 && (
          <TodoFilter
            filterBy={filterBy}
            setFilterBy={setFilterBy}
            activeTodosCount={activeTodosCount}
            hasCompletedTodosCount={hasCompletedTodosCount}
            clearCompleted={clearCompleted}
          />
        )}
      </div>

      <ErrorMessage
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
