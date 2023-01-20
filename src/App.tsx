/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { AuthContext } from './components/Auth/AuthContext';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
import {
  ErrorNotification,
} from './components/ErrorNotification/ErrorNotification';
import { Todo } from './types/Todo';
import { createTodo, deleteTodo, getTodos } from './api/todos';
import { TodoItem } from './components/TodoItem/TodoItem';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [removeTodo, setRemoveTodo] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState('All');
  const [title, setTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      getTodos(user.id)
        .then(setTodos)
        .catch(() => (
          setErrorMessage('Unable to load a todos')
        ));
    }
  }, []);

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  const incompleteTodos = useMemo(
    () => todos.filter(todo => !todo.completed),
    [todos],
  );

  const completeTodos = useMemo(
    () => todos.filter(todo => todo.completed),
    [todos],
  );

  const filterTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (filter) {
        case 'Completed':
          return todo.completed;

        case 'Active':
          return !todo.completed;

        default:
          return todo;
      }
    });
  }, [todos, filter]);

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title) {
      setErrorMessage('Title can\'t be empty');
    }

    if (user) {
      setTempTodo({
        id: 0,
        title,
        completed: false,
        userId: user.id,
      });

      setIsAdding(true);

      createTodo(title, user.id)
        .then(newTodo => {
          setTodos(prev => [...prev, {
            id: newTodo.id,
            userId: newTodo.userId,
            title: newTodo.title,
            completed: newTodo.completed,
          }]);
        })
        .catch(() => setErrorMessage('Unable to add a todo'))
        .finally(() => {
          setTempTodo(null);
          setTitle('');
          setIsAdding(false);
        });
    }
  };

  const handleDeleteClick = (deletedTodo: Todo) => {
    setRemoveTodo(todo => [...todo, deletedTodo]);

    deleteTodo(deletedTodo.id)
      .then(() => (
        setTodos(currentTodos => currentTodos
          .filter(todo => todo.id !== deletedTodo.id))
      ))
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
      });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">

        <Header
          newTodoField={newTodoField}
          title={title}
          onSetTitle={setTitle}
          onSubmit={handleFormSubmit}
          isAdding={isAdding}
        />

        <TodoList
          todos={filterTodos}
          removeTodo={removeTodo}
          handleDeleteClick={handleDeleteClick}
          isActive={isAdding}
        />

        {tempTodo && (
          <TodoItem
            todo={tempTodo}
            isActive={isAdding}
            handleDeleteClick={handleDeleteClick}
          />
        )}

        {todos.length > 0 && (
          <Footer
            incompleteTodos={incompleteTodos}
            completeTodos={completeTodos}
            filter={filter}
            setFilter={setFilter}
          />
        )}
      </div>

      {errorMessage && (
        <ErrorNotification
          error={errorMessage}
          onChange={setErrorMessage}
        />
      )}
    </div>
  );
};
