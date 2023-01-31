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
import { Filter } from './types/Filter';
import { getFilterTodos } from './components/helperFunction';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [completedFilter, setCompletedFilter] = useState<Filter>(Filter.all);
  const [title, setTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const handleError = () => {
    setTimeout(() => setErrorMessage(''), 3000);
  };

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    if (user) {
      getTodos(user.id)
        .then(setTodos)
        .catch(() => {
          setErrorMessage('Unable to load a todos');
          handleError();
        });
    }
  }, []);

  const incompleteTodos = useMemo(
    () => todos.filter(todo => !todo.completed),
    [todos],
  );

  const completeTodosLength = useMemo(
    () => todos.filter(todo => todo.completed).length,
    [todos],
  );

  const filterTodos = useMemo(() => {
    return getFilterTodos(todos, completedFilter);
  }, [todos, completedFilter]);

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title) {
      setErrorMessage('Title can\'t be empty');

      return;
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

  const handleDeleteClick = (id: number) => {
    deleteTodo(id)
      .then(() => (
        setTodos(currentTodos => currentTodos
          .filter(todo => todo.id !== id))
      ))
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
      });
  };

  const handleClearCompleted = () => {
    todos.forEach(todo => {
      if (todo.completed) {
        handleDeleteClick(todo.id);
      }
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
          // removeTodo={removeTodo}
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
            completeTodosLength={completeTodosLength}
            completedFilter={completedFilter}
            setCompletedFilter={setCompletedFilter}
            handleClearCompleted={handleClearCompleted}
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
