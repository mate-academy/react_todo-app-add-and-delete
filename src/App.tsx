/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import React, {
  useEffect,
  useState,
  useMemo,
  useRef,
} from 'react';
import { Todo } from './types/Todo';
import { List } from './components/List';
import { FilterTodos } from './types/FilterTodos';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import * as todoService from './api/todos';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todosError, setTodosError] = useState('');
  const [filtredTodos, setFiltredTodos] = useState(FilterTodos.All);

  useEffect(() => {
    setTodosError('');

    todoService
      .getTodos()
      .then(setTodos)
      .catch(() => {
        // eslint-disable-next-line no-console
        // console.warn(error);
        setTodosError('Unable to load todos');
      });
  }, []);

  const timerId = useRef<number>(0);

  useEffect(() => {
    if (timerId.current) {
      window.clearTimeout(timerId.current);
    }

    timerId.current = window.setTimeout(() => {
      setTodosError('');
    }, 3000);
  }, [todosError]);

  const isOneTodoCompleted = useMemo(() => todos
    .some(({ completed }) => completed), [todos]);

  const filterTodos = useMemo(() => todos
    .filter(({ completed }) => {
      switch (filtredTodos) {
        case FilterTodos.Active:
          return !completed;
        case FilterTodos.Completed:
          return completed;
        default:
          return true;
      }
    }), [todos, filtredTodos]);

  const handleAddTodo = (todoTitle: string) => {
    return todoService
      .addTodo(todoTitle)
      .then((newTitle) => {
        setTodos((prevTodo) => [...prevTodo, newTitle]);
      })
      .catch(() => {
        setTodosError('Unable to add a todo');
        throw new Error();
      });
  };

  const handleDeleteTodo = (todoId: number) => {
    todoService
      .deleteTodo(todoId)
      .then(() => {
        setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== todoId));
      })
      .catch(() => {
        setTodosError('Unable to delete a todo');
      });
  };

  const handleUpdateTodo = (todo: Todo, newTitle: string) => {
    todoService
      .updateTodo({
        id: todo.id,
        title: newTitle,
        userId: todo.userId,
        completed: todo.completed,
      }).then(updateTodo => {
        setTodos(prevState => prevState.map(curentTodo => (
          curentTodo.id !== updateTodo.id
            ? curentTodo
            : updateTodo
        )));
      });
  };

  const activeTodosCount = todos.filter(todo => !todo.completed).length;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          onTodoAdd={handleAddTodo}
          activeTodosCount={activeTodosCount}
        />

        <List
          filterTodos={filterTodos}
          onTodoDelete={handleDeleteTodo}
          onTodoUpdate={handleUpdateTodo}
        />

        {isOneTodoCompleted && (
          <Footer
            isOneTodoCompleted={isOneTodoCompleted}
            todos={filterTodos}
            filtredTodos={filtredTodos}
            setFiltredTodos={setFiltredTodos}
          />
        )}

      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          {
            hidden: !todosError.length,
          },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setTodosError('')}
        />
        {/* show only one message at a time */}
        {todosError}
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
