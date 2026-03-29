/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState, useRef } from 'react';
import { UserWarning } from './UserWarning';
import * as postServices from './api/todos';
import { Todo } from './types/Todo';
import { FilterStatus } from './types/FilterStatus';
import { Footer } from './components/footer/Footer';
import { Main } from './components/main/Main';
// eslint-disable-next-line max-len
import { ErrorNotification } from './components/errorNotification/ErrorNotification';
import { Header } from './components/header/Header';

export const App: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [toDos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterStatus>(FilterStatus.All);
  const [isAdding, setIsAdding] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);
  const isAllCompleted = toDos.length > 0 && toDos.every(t => t.completed);
  const visibleTodos = toDos.filter(todo => {
    if (filter === FilterStatus.Active) {
      return !todo.completed;
    }

    if (filter === FilterStatus.Completed) {
      return todo.completed;
    }

    return true;
  });

  function showError(message: string) {
    setError(message);

    setTimeout(() => {
      setError(null);
    }, 3000);
  }

  useEffect(() => {
    setError(null);
    postServices
      .getTodos()
      .then(data => {
        setTodos(data);
        inputRef.current?.focus();
      })
      .catch(() => showError('Unable to load todos'));

    inputRef.current?.focus();
  }, []);

  function handleAddTodo(event: React.FormEvent) {
    event.preventDefault();

    const title = inputValue.trim();

    if (!title) {
      showError('Title should not be empty');

      return;
    } else {
      setIsAdding(true);

      const toDo = {
        id: 0,
        title: title,
        userId: postServices.USER_ID,
        completed: false,
      };

      setTempTodo(toDo);

      postServices
        .postTodo(toDo)
        .then(newTodo => {
          setTodos(prev => [...prev, newTodo]);
          setInputValue('');
        })
        .catch(() => {
          showError('Unable to add a todo');
          inputRef.current?.focus();
        })
        .finally(() => {
          setIsAdding(false);
          setTempTodo(null);
          setTimeout(() => {
            inputRef.current?.focus();
          }, 0);
        });
    }
  }

  function handlerDeleteTodo(todoId: number) {
    setDeleting(todoId);
    postServices
      .deleteTodo(todoId)
      .then(() =>
        setTodos(prev => {
          return prev.filter(toDo => toDo.id !== todoId);
        }),
      )
      .catch(() => showError('Unable to delete a todo'))
      .finally(() => {
        setDeleting(null);
        inputRef.current?.focus();
      });
    // postServices.deleteTodo(todoId)
    // setTodos(() => toDos.filter((toDo) => toDo.id != todoId));
  }

  const handleClearCompleted = async () => {
    const completedTodos = toDos.filter(todo => todo.completed);
    const idsToDelete = completedTodos.map(t => t.id);

    const results = await Promise.allSettled(
      idsToDelete.map(id => postServices.deleteTodo(id)),
    );

    const successfullyDeletedIds: number[] = [];
    let hasError = false;

    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        successfullyDeletedIds.push(idsToDelete[index]);
      } else {
        hasError = true;
      }
    });

    setTodos(prev =>
      prev.filter(todo => !successfullyDeletedIds.includes(todo.id)),
    );

    if (hasError) {
      showError('Unable to delete a todo');
    }

    setTimeout(() => inputRef.current?.focus(), 0);
  };

  if (!postServices.USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          isAllCompleted={isAllCompleted}
          inputRef={inputRef}
          handleAddTodo={handleAddTodo}
          isAdding={isAdding}
          inputValue={inputValue}
          setInputValue={setInputValue}
        />

        <Main
          visibleTodos={visibleTodos}
          tempTodo={tempTodo}
          handlerDeleteTodo={handlerDeleteTodo}
          deleting={deleting}
        />

        {toDos.length === 0 ? (
          ''
        ) : (
          <Footer
            filter={filter}
            activeCount={toDos.filter(todo => !todo.completed).length}
            hasCompleted={toDos.some(todo => todo.completed)}
            onFilterChange={setFilter}
            onClear={handleClearCompleted}
          />
        )}

        <ErrorNotification error={error} onClose={() => setError(null)} />
      </div>
    </div>
  );
};
