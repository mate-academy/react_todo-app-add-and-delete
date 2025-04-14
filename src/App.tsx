/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  createTodos,
  deleteTodos,
  getTodos,
  updateTodos,
  USER_ID,
} from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { FilterType } from './types/FilterType';
import { Header } from './components/Header';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todoTitle, setTodoTitle] = useState('');
  const [filter, setFilter] = useState<FilterType>(FilterType.all);
  const [titleErrorMessage, setTitleErrorMessage] = useState('');
  const [addErrorMessage, setAddErrorMessage] = useState('');
  const [deleteErrorMessage, setDeleteErrorMessage] = useState('');
  const [updateErrorMessage, setUpdateErrorMessage] = useState('');
  const [loadingErrorMessage, setLoadingErrorMessage] = useState('');

  const [isAdding, setIsAdding] = useState(false);

  const titleField = useRef<HTMLInputElement>(null);
  const errorTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(error => {
        setLoadingErrorMessage('Unable to load todos');
        throw error;
      });

    if (titleField.current) {
      titleField.current.focus();
    }
  }, []);

  useEffect(() => {
    if (
      titleErrorMessage ||
      addErrorMessage ||
      updateErrorMessage ||
      loadingErrorMessage
    ) {
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }

      errorTimeoutRef.current = setTimeout(() => {
        setTitleErrorMessage('');
        setAddErrorMessage('');
        setUpdateErrorMessage('');
        setLoadingErrorMessage('');
      }, 3000);
    }

    return () => {
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }
    };
  }, [
    titleErrorMessage,
    addErrorMessage,
    updateErrorMessage,
    loadingErrorMessage,
  ]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const addTodo = ({
    title,
    completed,
  }: {
    title: string;
    completed: boolean;
  }) => {
    setAddErrorMessage('');
    if (errorTimeoutRef.current) {
      clearTimeout(errorTimeoutRef.current);
    }

    setTitleErrorMessage('');
    setIsAdding(true);

    setTodos(currentTodos => [
      ...currentTodos,
      {
        userId: USER_ID,
        title,
        completed,
        loading: true,
        id: Date.now() + Math.random(),
      },
    ]);
    createTodos({ userId: USER_ID, title, completed })
      .then(newTodo => {
        setTodos(currentTodos =>
          currentTodos.map((todo, index) => {
            if (currentTodos.length - 1 === index) {
              return newTodo;
            }

            return todo;
          }),
        );
        setTodoTitle('');
      })
      .catch(error => {
        setAddErrorMessage('Unable to add a todo');
        setTodos(currentTodos => {
          const currentTodosCopy = [...currentTodos];

          currentTodosCopy.pop();

          return currentTodosCopy;
        });
        throw error;
      })
      .finally(() => {
        setIsAdding(false);
        setTimeout(() => titleField.current?.focus(), 0);
      });
  };

  const removeTodo = (todoId: number) => {
    setTodos(currentTodos =>
      currentTodos.map(todo =>
        todo.id === todoId ? { ...todo, loading: true } : todo,
      ),
    );

    deleteTodos(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );

        titleField.current?.focus();
      })
      .catch(error => {
        setAddErrorMessage('Unable to delete a todo');
        setTodos(currentTodos =>
          currentTodos.map(todo =>
            todo.id === todoId ? { ...todo, loading: false } : todo,
          ),
        );
        throw error;
      });
  };

  const updateTodo = (todoId: number) => {
    const todoToUpdate = todos.find(todo => todo.id === todoId);

    if (!todoToUpdate) {
      return;
    }

    const updatedTodo = {
      ...todoToUpdate,
      completed: !todoToUpdate.completed,
    };

    updateTodos(updatedTodo)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.map(todo => (todoId === todo.id ? updatedTodo : todo)),
        );
      })
      .catch(error => {
        setUpdateErrorMessage('Unable to update a todo');
        throw error;
      });
  };

  const removeAllTodos = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    const deletePromises = completedTodos.map(todo =>
      deleteTodos(todo.id)
        .then(() => ({ id: todo.id, success: true }))
        .catch(() => ({ id: todo.id, success: false })),
    );

    Promise.all(deletePromises).then(results => {
      const failed = results.filter(result => !result.success).map(r => r.id);
      const succeeded = results.filter(result => result.success).map(r => r.id);

      setTodos(currentTodos =>
        currentTodos.filter(todo => !succeeded.includes(todo.id)),
      );

      if (failed.length > 0) {
        setDeleteErrorMessage('Unable to delete a todo');
      }

      titleField.current?.focus();
    });
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTodoTitle(event.target.value);
  };

  const handleAllCompleted = () => {
    const allCompleted = todos.every(todo => todo.completed);

    setTodos(currentTodos =>
      currentTodos.map(todo => ({
        ...todo,
        completed: !allCompleted,
      })),
    );
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!todoTitle.trim()) {
      setTitleErrorMessage('Title should not be empty');
      titleField.current?.focus();

      return;
    }

    addTodo({ title: todoTitle.trim(), completed: false });
    setTitleErrorMessage('');
  };

  const visibleTodos = todos.filter(todo => {
    if (filter === FilterType.active) {
      return !todo.completed;
    }

    if (filter === FilterType.completed) {
      return todo.completed;
    }

    return true;
  });

  const setErrors = () => {
    setTitleErrorMessage('');
    setAddErrorMessage('');
    setDeleteErrorMessage('');
    setUpdateErrorMessage('');
    setLoadingErrorMessage('');
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          titleField={titleField}
          todoTitle={todoTitle}
          handleTitleChange={handleTitleChange}
          handleAllCompleted={handleAllCompleted}
          isAdding={isAdding}
          onSubmit={onSubmit}
        />

        <TodoList
          todos={visibleTodos}
          removeTodo={removeTodo}
          updateTodo={updateTodo}
        />

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <Footer
            todos={todos}
            removeAllTodos={removeAllTodos}
            filter={filter}
            setFilter={setFilter}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${
          titleErrorMessage ||
          addErrorMessage ||
          deleteErrorMessage ||
          updateErrorMessage ||
          loadingErrorMessage
            ? ''
            : 'hidden'
        }`}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={setErrors}
        />
        {titleErrorMessage ||
          addErrorMessage ||
          deleteErrorMessage ||
          updateErrorMessage ||
          loadingErrorMessage}
      </div>
    </div>
  );
};
