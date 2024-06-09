/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID, addTodos, deleteTodos, getTodos } from './api/todos';
import { Header } from './Components/Header/Header';
import { Todo } from './types/Todo';
import { Footer } from './Components/Footer/Footer';
import { TodoList } from './Components/TodoList/TodoList';
import { Errors } from './Components/Errors/Errors';
import { Status } from './types/Status';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [status, setStatus] = useState(Status.All);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [inputDisabled, setInputDisabled] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState<number[]>([]);
  const [inputTitle, setInputTitle] = useState('');

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputTitle(event.target.value);
  };

  const itemsLeft = todos.filter(todo => !todo.completed).length;

  const clearAllButtonActive = todos.length - itemsLeft;

  function onAdd({ userId, completed }: Todo) {
    setInputDisabled(true);
    const trimmedTitle = inputTitle.trim();

    if (!trimmedTitle) {
      setErrorMessage('Title should not be empty');
      setInputDisabled(false);
      setTimeout(() => setErrorMessage(''), 3000);

      return;
    }

    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    });

    setIsLoading(current => [...current, 0]);

    return addTodos({ userId, title: trimmedTitle, completed })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setInputTitle('');
      })
      .catch(error => {
        setErrorMessage('Unable to add a todo');
        setInputDisabled(false);
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
        throw error;
      })
      .finally(() => {
        setIsLoading(current => current.filter(todoId => todoId !== 0));
        setInputDisabled(false);
        setTempTodo(null);
      });
  }

  function onDelete(todoId: number) {
    setInputDisabled(true);
    setIsLoading(curr => [...curr, todoId]);
    deleteTodos(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(error => {
        setErrorMessage('Unable to delete a todo');
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
        throw error;
      })
      .finally(() => {
        setIsLoading(curr =>
          curr.filter(deletingTodoId => todoId !== deletingTodoId),
        );
        setInputDisabled(false);
      });
  }

  function deleteAllComplete() {
    const completedTodos = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    completedTodos.forEach(todoId => onDelete(todoId));
  }

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage('Unable to load todos'))
      .finally(() => setTimeout(() => setErrorMessage(''), 3000));
  }, []);

  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (status) {
        case Status.Completed:
          return todo.completed;

        case Status.Active:
          return !todo.completed;

        default:
          return true;
      }
    });
  }, [todos, status]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={filteredTodos}
          onSubmit={onAdd}
          setError={setErrorMessage}
          inputDisabled={inputDisabled}
          setInputDisabled={() => setInputDisabled}
          inputTitle={inputTitle}
          handleTitleChange={handleTitleChange}
          error={errorMessage}
        />

        {!!todos.length && (
          <TodoList
            todos={filteredTodos}
            onDelete={onDelete}
            isLoading={isLoading}
            tempTodo={tempTodo}
          />
        )}

        {/* Hide the footer if there are no todos */}
        {!!todos.length && (
          <Footer
            status={status}
            onClick={setStatus}
            itemsLeft={itemsLeft}
            clearAllButtonActive={clearAllButtonActive}
            deleteAllComplete={deleteAllComplete}
          />
        )}
      </div>
      <Errors error={errorMessage} onClose={() => setErrorMessage('')} />
    </div>
  );
};
