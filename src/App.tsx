/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Status } from './types/Status';
import { TodoList } from './components/TodoList';
import { Notification } from './components/Notification';
import * as todoService from './api/todos';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filterStatus, setFilterStatus] = useState<Status>(Status.All);
  const [newTitle, setNewTitle] = useState('');
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [loading, setLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const visibleTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (filterStatus) {
        case Status.All:
          return true;

        case Status.Active:
          return !todo.completed;

        case Status.Completed:
          return todo.completed;
      }
    });
  }, [todos, filterStatus]);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [loading]);

  const errorTimeout = useRef<number | null>(null);

  const showError = (message: string) => {
    setErrorMessage(message);

    if (errorTimeout.current) {
      clearTimeout(errorTimeout.current);
    }

    errorTimeout.current = window.setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  };

  useEffect(() => {
    setLoading(true);

    todoService
      .getTodos()
      .then(setTodos)
      .catch(() => {
        showError('Unable to load todos');
      })
      .finally(() => setLoading(false));
  }, []);

  if (!todoService.USER_ID) {
    return <UserWarning />;
  }

  const completedTodos = todos.filter(todo => todo.completed);
  const activeTodos = todos.filter(todo => !todo.completed);
  const allTodosAreActive =
    todos.length > 0 && todos.every(todo => todo.completed);

  const addTodo = (newTodo: Omit<Todo, 'id'>) => {
    setLoading(true);

    const optimisticTodo: Todo = {
      ...newTodo,
      id: 0,
    };

    setTempTodo(optimisticTodo);

    todoService
      .createTodo(newTodo)
      .then(addedTodo => {
        setTodos(current => [...current, addedTodo]);
        setNewTitle('');
        setTempTodo(null);
      })
      .catch(() => {
        showError('Unable to add a todo');
        setTempTodo(null);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleAddTodo = () => {
    const trimmedTitle = newTitle.trim();

    if (!trimmedTitle) {
      showError('Title should not be empty');

      return;
    }

    const newTodo: Omit<Todo, 'id'> = {
      userId: todoService.USER_ID,
      title: trimmedTitle,
      completed: false,
    };

    addTodo(newTodo);
  };

  const deleteTodo = (todoId: number) => {
    const todoToDelete = todos.find(todo => todo.id === todoId);

    setSelectedTodo(todoToDelete || null);

    todoService
      .deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(post => post.id !== todoId),
        );

        if (inputRef.current) {
          inputRef.current.focus();
        }
      })
      .catch(() => showError('Unable to delete a todo'));
  };

  const deleteCompleted = async () => {
    const completed = todos.filter(todo => todo.completed);

    if (completed.length === 0) {
      return;
    }

    const idsToDelete = completed.map(todo => todo.id);
    const result = await Promise.allSettled(
      idsToDelete.map(id => todoService.deleteTodo(id)),
    );

    const succesfulIds: number[] = [];

    result.forEach((res, i) => {
      if (res.status === 'fulfilled') {
        succesfulIds.push(idsToDelete[i]);
      }
    });

    setTodos(current =>
      current.filter(todo => !succesfulIds.includes(todo.id)),
    );

    const hasErrors = result.some(res => res.status === 'rejected');

    if (inputRef.current) {
      inputRef.current.focus();
    }

    if (hasErrors) {
      showError('Unable to delete a todo');
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          allTodosAreActive={allTodosAreActive}
          title={newTitle}
          setTitle={setNewTitle}
          addTodo={handleAddTodo}
          loading={loading}
          inputRef={inputRef}
        />

        <TodoList
          todos={visibleTodos}
          selectedTodoId={selectedTodo?.id}
          deleteTodo={deleteTodo}
          tempTodo={tempTodo}
        />

        {todos.length > 0 && (
          <Footer
            activeTodos={activeTodos}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            completedTodos={completedTodos}
            handleDeleteCompleted={deleteCompleted}
          />
        )}
      </div>

      <Notification
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
