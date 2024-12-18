/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState, useRef } from 'react';
import { UserWarning } from './UserWarning';
import { createTodo, deleteTodo, getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorMes } from './components/ErrorMes';
import { FilterName } from './types/enumFilterName';
import { Error } from './types/enumError';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<Error | ''>('');
  const [filteredBy, setFilteredBy] = useState<FilterName>(FilterName.ALL);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [todoIdLoading, setTodoIdLoading] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const activeTodos = todos.filter(todo => !todo.completed).length;

  function loadTodos() {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage(Error.Load);
        setTimeout(() => setErrorMessage(''), 3000);
      });
  }

  useEffect(() => {
    if (!isInputDisabled && inputRef.current) {
      inputRef.current?.focus();
    }
  }, [isInputDisabled]);

  useEffect(() => {
    loadTodos();
  }, []);

  const handleNewTodoTitleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setNewTodoTitle(event.target.value);
  };

  function addPost(loadingTodo: Todo) {
    setErrorMessage('');
    createTodo({
      userId: loadingTodo.userId,
      title: loadingTodo.title,
      completed: loadingTodo.completed,
    })
      .then(newTodo => {
        setTempTodo(null);
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setNewTodoTitle('');
      })
      .catch(() => {
        setErrorMessage(Error.Add);
        setTimeout(() => setErrorMessage(''), 3000);
        setTempTodo(null);
      })
      .finally(() => {
        setIsInputDisabled(false);
        if (inputRef.current) {
          inputRef.current?.focus();
        }
      });
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!newTodoTitle.trim()) {
      setErrorMessage(Error.Empty);
      setTimeout(() => setErrorMessage(''), 3000);

      return;
    }

    const loadingTodo: Todo = {
      userId: USER_ID,
      title: newTodoTitle.trim(),
      completed: false,
      id: 0,
    };

    setTempTodo(loadingTodo);
    setIsInputDisabled(true);
    addPost(loadingTodo);
  }

  function deletePost(todoId: number) {
    setTodoIdLoading(todoId);
    deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
        setTodoIdLoading(null);
      })
      .catch(() => {
        setErrorMessage(Error.Delete);
        setTodoIdLoading(null);
        setTimeout(() => setErrorMessage(''), 3000);
      })
      .finally(() => {
        if (!isInputDisabled && inputRef.current) {
          inputRef.current?.focus();
        }
      });
  }

  function deleteCompleted() {
    todos.map(todo => {
      if (todo.completed) {
        deletePost(todo.id);
      }
    });
  }

  const filteredTodos = useMemo(() => {
    switch (filteredBy) {
      case FilterName.ACTIVE:
        return todos.filter(todo => !todo.completed);
      case FilterName.COMPLETED:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [todos, filteredBy]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          activeTodos={activeTodos}
          handleSubmit={handleSubmit}
          handleNewTodoTitleChange={handleNewTodoTitleChange}
          isInputDisabled={isInputDisabled}
          newTodoTitle={newTodoTitle}
          inputRef={inputRef}
        />
        {todos.length > 0 && (
          <TodoList
            filteredTodos={filteredTodos}
            tempTodo={tempTodo}
            todoIdLoading={todoIdLoading}
            deletePost={deletePost}
          />
        )}
        {todos.length > 0 && (
          <Footer
            activeTodos={activeTodos}
            filteredBy={filteredBy}
            setFilteredBy={setFilteredBy}
            todos={todos}
            deleteCompleted={deleteCompleted}
          />
        )}
      </div>

      <ErrorMes errorMessage={errorMessage} />
    </div>
  );
};
