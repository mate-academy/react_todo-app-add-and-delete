/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/privateID';
import * as todoService from './api/todos';
import { Todo } from './types/Todo';
import { TodoForm } from './Components/TodoForm/TodoForm';
import { TodoList } from './Components/TodoList/TodoList';
import { Footer } from './Components/Footer/Footer';
import { ErrorNotification }
  from './Components/ErrorNotification/ErrorNotification';
import { FilterType } from './utils/FilterType';
import { Error } from './utils/Error';
import { TodoItem } from './Components/TodoItem/TodoItem';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filterType, setFilterType] = useState<FilterType>(FilterType.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [value, setValue] = useState('');
  const [deletingIds, setDeletingIds] = useState<number[]>([]);

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    todoService.getTodos()
      .then((response) => {
        setTodos(response);
      })
      .catch(() => setErrorMessage(Error.Load));
  }, []);

  useEffect(() => {
    if (errorMessage) {
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    }
  }, [errorMessage]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const visibleTodos = todos.filter(todo => {
    switch (filterType) {
      case FilterType.Active:
        return !todo.completed;

      case FilterType.Completed:
        return todo.completed;

      case FilterType.All:
      default:
        return true;
    }
  });

  function addTodo({ title, userId, completed }: Todo) {
    setErrorMessage(Error.None);
    const todoTitle = value.trim();

    return todoService.createTodos({ title, userId, completed })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setValue('');
      })
      .catch(() => {
        setErrorMessage(Error.Add);
        setValue(todoTitle);
      });
  }

  const handleSubmit = (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    const todoTitle = value.trim();

    const newTodo: Todo = {
      id: todos.length + 1,
      title: todoTitle,
      completed: false,
      userId: USER_ID,
    };

    const tempTodoProto: Todo = { ...newTodo, id: 0 };

    if (!todoTitle) {
      setErrorMessage(Error.EmptyTitle);
      setIsSubmitting(false);
    } else {
      setTempTodo(tempTodoProto);

      addTodo(newTodo)
        .finally(() => {
          setTempTodo(null);
          setIsSubmitting(false);
        });
    }
  };

  const onDelete = (idTodo: number) => {
    setDeletingIds((ids) => [...ids, idTodo]);

    todoService.deleteTodo(idTodo)
      .then(() => {
        setTodos(currentTodos => currentTodos
          .filter(todo => idTodo !== todo.id));
      })
      .catch(() => {
        setErrorMessage(Error.Delete);
      })
      .finally(() => {
        setDeletingIds((ids) => ids.filter(id => id !== idTodo));
      });

    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const onDeleteCompleted = () => {
    todos.filter(todo => todo.completed).forEach((todo) => {
      onDelete(todo.id);
    });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoForm
          todos={todos.length}
          value={value}
          setValue={setValue}
          handleSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          inputRef={inputRef}
        />

        {todos.length !== 0 && (
          <>
            <TodoList
              todos={visibleTodos}
              onDelete={onDelete}
              deletingIds={deletingIds}
            />

            {tempTodo && (
              <TodoItem
                todo={tempTodo}
                isSubmitting={isSubmitting}
                onDelete={onDelete}
                deletingIds={deletingIds}
              />
            )}

            <Footer
              setFilterType={setFilterType}
              filterType={filterType}
              todos={todos}
              onDeleteCompleted={onDeleteCompleted}
            />
          </>
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
