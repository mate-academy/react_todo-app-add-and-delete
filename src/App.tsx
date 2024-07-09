/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID, getTodos } from './api/todos';
import { SelectedStatus, Todo } from './types/Todo';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedStatus, setSelectedStatus] = useState(SelectedStatus.all);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSetStatus(e: React.MouseEvent<HTMLElement>) {
    const target = e.target as HTMLElement;

    setSelectedStatus(target.textContent as SelectedStatus);
  }

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
      });
  }, []);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    return () => clearTimeout(timerId);
  }, [errorMessage]);

  function changeTodo(todoId: number) {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === todoId ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  }

  function addTodo(newTodo: Todo) {
    setTodos(currentTodos => [...currentTodos, newTodo]);

    if (inputRef.current) {
      inputRef.current.focus();
    }
  }

  function deleteTodo(todoId: number) {
    setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));

    if (inputRef.current) {
      inputRef.current.focus();
    }
  }

  function deleteAllCompletedTodo(todosToDelete: Todo[]) {
    setTodos(currentTodos =>
      currentTodos.filter(todo => !todosToDelete.includes(todo)),
    );

    if (inputRef.current) {
      inputRef.current.focus();
    }
  }

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          onTempTodo={setTempTodo}
          onSubmit={addTodo}
          onErrorMessage={setErrorMessage}
          inputRef={inputRef}
        />

        <TodoList
          todos={todos}
          status={selectedStatus}
          onCheckTodo={changeTodo}
          tempTodo={tempTodo}
          onDeleteTodo={deleteTodo}
          onErrorMessage={setErrorMessage}
        />

        <Footer
          todos={todos}
          selectedStatus={selectedStatus}
          setStatus={handleSetStatus}
          onDeleteCompletedTodo={deleteAllCompletedTodo}
          onErrorMessage={setErrorMessage}
        />
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
