/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState, useRef, useMemo } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import * as todosApi from './api/todos';
import { Todo } from './types/Todo';
import { FilterType } from './types/FilterType';
import { Error } from './components/Error';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { TempTodo } from './components/TempTodo';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [query, setQuery] = useState<FilterType>(FilterType.All);
  const [leftItems, setLeftItems] = useState<number>(0);
  const [todoStatus, setTodoStatus] = useState<boolean>(false);
  const [todoLoaderId, setTodoLoaderId] = useState<number>(0);
  const [edditingTodo, setEdditingTodo] = useState<number>();
  const [edditingTodoTitle, setEdditingTodoTitle] = useState<string>('');
  const [currentCreatedTodo, setCurrentCreatedTodo] = useState<string>('');
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);
  const headerInputRef = useRef<HTMLInputElement>(null);
  const [allCompleted, setAllCompleted] = useState<boolean>(false);
  const [tempTodo, setTempTodo] = useState<Omit<Todo, 'id'> | null>(null);

  const filteredTodos = useMemo(() => {
    switch (query) {
      case FilterType.Active:
        return todos.filter(todo => !todo.completed);
      case FilterType.Completed:
        return todos.filter(todo => todo.completed);
      case FilterType.All:
      default:
        return todos;
    }
  }, [todos, query]);

  useEffect(() => {
    todosApi
      .getTodos()
      .then(fetchedTodos => {
        setTodos(fetchedTodos);
        setLeftItems(fetchedTodos.filter(todo => !todo.completed).length);
        setAllCompleted(
          fetchedTodos.length > 0 && fetchedTodos.every(todo => todo.completed),
        );
      })
      .catch(() => {
        setError('Unable to load todos');
        setTimeout(() => setError(''), 3000);
      });
  }, []);

  useEffect(() => {
    setLeftItems(todos.filter(todo => !todo.completed).length);
    setAllCompleted(todos.length > 0 && todos.every(todo => todo.completed));
  }, [todos]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [edditingTodo]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          headerInputRef={headerInputRef}
          setTempTodo={setTempTodo}
          isCreating={isCreating}
          setIsCreating={setIsCreating}
          currentCreatedTodo={currentCreatedTodo}
          setCurrentCreatedTodo={setCurrentCreatedTodo}
          setTodos={setTodos}
          setError={setError}
          todos={todos}
          allCompleted={allCompleted}
          setAllCompleted={setAllCompleted}
          setTodoStatus={setTodoStatus}
        />

        <TodoList
          filteredTodos={filteredTodos}
          setTodoStatus={setTodoStatus}
          setTodos={setTodos}
          inputRef={inputRef}
          edditingTodoTitle={edditingTodoTitle}
          setEdditingTodoTitle={setEdditingTodoTitle}
          edditingTodo={edditingTodo}
          setEdditingTodo={setEdditingTodo}
          todoStatus={todoStatus}
          setError={setError}
          todos={todos}
          todoLoaderId={todoLoaderId}
          setTodoLoaderId={setTodoLoaderId}
        />

        {tempTodo?.title && <TempTodo todo={{ id: 0, ...tempTodo }} />}

        {todos.length > 0 && (
          <Footer
            leftItems={leftItems}
            query={query}
            setQuery={setQuery}
            todos={todos}
            setTodos={setTodos}
            setError={setError}
          />
        )}

        <Error error={error} setError={setError} />
      </div>
    </div>
  );
};
