/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect, useRef } from 'react';
import { UserWarning } from './UserWarning';
import { ErrorMessage } from './types/ErrorMessage';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { ErrorNotification } from './components/ErrorNotification';
import { Todo } from './types/Todo';
import {
  USER_ID,
  getTodos,
  createTodo,
  deleteTodo,
  updateTodo,
} from './api/todos';
import { FilterType } from './constants/constants';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage | null>(null);
  const [filterBy, setFilterBy] = useState<FilterType>(FilterType.All);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processingTodoId, setProcessingTodoId] = useState<number | null>(null);
  const [isTogglingAll, setIsTogglingAll] = useState(false);
  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage(ErrorMessage.Load));
  }, []);

  useEffect(() => {
    if (errorMessage !== null) {
      const timer = setTimeout(() => {
        setErrorMessage(null);
      }, 3000);

      return () => clearTimeout(timer);
    }

    return;
  }, [errorMessage]);

  useEffect(() => {
    if (newTodoField.current && !loading) {
      newTodoField.current.focus();
    }
  }, [todos.length, loading]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleClearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    if (completedTodos.length === 0) {
      return;
    }

    Promise.allSettled(completedTodos.map(todo => deleteTodo(todo.id))).then(
      results => {
        const successfulIds = completedTodos
          .filter((_, index) => results[index].status === 'fulfilled')
          .map(todo => todo.id);

        setTodos(prevTodos =>
          prevTodos.filter(todo => !successfulIds.includes(todo.id)),
        );

        if (results.some(result => result.status === 'rejected')) {
          setErrorMessage(ErrorMessage.Delete);
        }
      },
    );
  };

  const handleDelete = (id: number) => {
    setProcessingTodoId(id);
    deleteTodo(id)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
      })
      .catch(() => setErrorMessage(ErrorMessage.Delete))
      .finally(() => setProcessingTodoId(null));
  };

  const handleToggle = (todoToToggle: Todo) => {
    setProcessingTodoId(todoToToggle.id);
    updateTodo(todoToToggle.id, { completed: !todoToToggle.completed })
      .then(updatedTodo => {
        setTodos(prevTodos =>
          prevTodos.map(todo =>
            todo.id === updatedTodo.id ? updatedTodo : todo,
          ),
        );
      })
      .catch(() => setErrorMessage(ErrorMessage.Update))
      .finally(() => setProcessingTodoId(null));
  };

  const handleToggleAll = () => {
    const areAllCompleted = todos.every(todo => todo.completed);

    setIsTogglingAll(true);

    Promise.allSettled(
      todos.map(todo => updateTodo(todo.id, { completed: !areAllCompleted })),
    )
      .then(results => {
        const updatedTodos = results.map((result, index) =>
          result.status === 'fulfilled' ? result.value : todos[index],
        );

        setTodos(updatedTodos);

        if (results.some(result => result.status === 'rejected')) {
          setErrorMessage(ErrorMessage.Update);
        }
      })
      .finally(() => setIsTogglingAll(false));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setErrorMessage(ErrorMessage.Title);

      return;
    }

    setLoading(true);
    setTempTodo({
      id: -Date.now(),
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    });

    createTodo(trimmedTitle)
      .then(newTodo => {
        setTodos(prevTodos => [...prevTodos, newTodo]);
        setTitle('');
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.Add);
      })
      .finally(() => {
        setLoading(false);
        setTempTodo(null);
        newTodoField.current?.focus();
      });
  };

  let filteredTodos = todos;

  if (filterBy === FilterType.Active) {
    filteredTodos = todos.filter(todo => !todo.completed);
  } else if (filterBy === FilterType.Completed) {
    filteredTodos = todos.filter(todo => todo.completed);
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <Header
        title="todos"
        newTitle={title}
        setNewTitle={setTitle}
        onSubmit={handleSubmit}
        loading={loading}
        inputRef={newTodoField}
        todos={todos}
        handleToggleAll={handleToggleAll}
      />

      <div className="todoapp__content">
        {todos.length > 0 && (
          <>
            <TodoList
              todos={filteredTodos}
              onToggle={handleToggle}
              onDelete={handleDelete}
              processingTodoId={processingTodoId}
              tempTodo={tempTodo}
              isTogglingAll={isTogglingAll}
            />

            <Footer
              todosCount={todos.filter(todo => !todo.completed).length}
              filterBy={filterBy}
              setFilterBy={setFilterBy}
              hasCompleted={todos.some(todo => todo.completed)}
              handleClearCompleted={handleClearCompleted}
            />
          </>
        )}

        <ErrorNotification
          message={errorMessage}
          onClose={() => setErrorMessage(null)}
        />
      </div>
    </div>
  );
};
