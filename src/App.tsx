/* eslint-disable max-len */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

import React, { useState, useEffect, useRef } from 'react';
import { UserWarning } from './UserWarning';
import {
  getTodos,
  deleteTodo,
  createTodo,
  updateTodo,
  USER_ID,
} from './api/todos';
import { TodoFilter } from './components/TodoFilter';
import { Todo } from './types/Todo';
import { TodoStatus } from './types/TodoStatus';
import { TodoList } from './components/TodoList';
import { Header } from './components/Header';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEdited, setIsEdited] = useState(false);
  const [selectedTodoId, setSelectedTodoId] = useState<number | null>(null);
  const [status, setStatus] = useState<TodoStatus>(TodoStatus.All);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);

    setIsChecked(false);
  };

  const handleToggleAllClick = () => {
    const allCompleted = todos.every(todo => todo.completed);

    const updatedTodos = todos.map(todo => ({
      ...todo,
      completed: !allCompleted,
      isSubmitting: true,
    }));

    setTodos(updatedTodos);

    const updatePromises = updatedTodos.map(updatedTodo =>
      updateTodo(updatedTodo).catch(() => {
        setErrorMessage('Unable to update todos');
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);

        setTodos(todos);

        throw new Error('Unable to update todos');
      }),
    );

    Promise.all(updatePromises).finally(() => {
      setTodos(prevTodos =>
        prevTodos.map(t =>
          updatedTodos.find(updatedTodo => updatedTodo.id === t.id)
            ? { ...t, isSubmitting: false }
            : t,
        ),
      );
    });
  };

  const handleCheckedChange = (todoId: number) => {
    const todo = todos.find(t => t.id === todoId);

    if (!todo) {
      return;
    }

    const previousTodo = { ...todo };

    const updatedTodo = {
      ...todo,
      completed: !todo.completed,
      isSubmitting: true,
    };

    setTodos(currentTodos =>
      currentTodos.map(t => (t.id === todoId ? updatedTodo : t)),
    );

    updateTodo(updatedTodo)
      .catch(() => {
        setErrorMessage('Unable to update a todo');
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);

        setTodos(currentTodos =>
          currentTodos.map(t => (t.id === todoId ? previousTodo : t)),
        );

        throw new Error('Unable to update a todo');
      })
      .finally(() => {
        setTodos(prevTodos =>
          prevTodos.map(t =>
            t.id === todoId ? { ...t, isSubmitting: false } : t,
          ),
        );
      });
  };

  const deleteThisTodo = (todoId: number) => {
    setTodos(currentTodos =>
      currentTodos.map(todo =>
        todo.id === todoId ? { ...todo, isSubmitting: true } : todo,
      ),
    );

    return deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        setTodos(currentTodos =>
          currentTodos.map(todo =>
            todo.id === todoId ? { ...todo, isSubmitting: false } : todo,
          ),
        );
        setErrorMessage('Unable to delete a todo');
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      })
      .finally(() => {
        setIsSubmitting(false);
        inputRef.current?.focus();
      });
  };

  const handleTitleChange = (todoId: number, newTitle: string) => {
    const todo = todos.find(t => t.id === todoId);

    if (!todo) {
      return;
    }

    if (!newTitle.trim()) {
      deleteThisTodo(todoId);

      return;
    }

    if (todo.title === newTitle.trim()) {
      setIsEdited(false);

      return;
    }

    setTodos(prevTodos =>
      prevTodos.map(t => (t.id === todoId ? { ...t, isSubmitting: true } : t)),
    );

    return updateTodo({ ...todo, title: newTitle })
      .then(() => {
        setTodos(prevTodos =>
          prevTodos.map(t =>
            t.id === todoId
              ? { ...t, title: newTitle, isSubmitting: false }
              : t,
          ),
        );

        setIsEdited(false);
        setSelectedTodoId(null);
      })
      .catch(() => {
        setErrorMessage('Unable to update a todo');

        setTodos(prevTodos =>
          prevTodos.map(t =>
            t.id === todoId ? { ...t, isSubmitting: false } : t,
          ),
        );

        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      });
  };

  const submitChangedTitle = (e, todo) => {
    e.preventDefault();
    const newTitle = e.target[0].value.trim();

    handleTitleChange(todo.id, newTitle);
  };

  const addTodo = (event: React.FormEvent) => {
    event.preventDefault();

    if (!query.trim()) {
      setErrorMessage('Title should not be empty');
      setIsSubmitting(false);
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);

      return;
    }

    const tempTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title: query.trim(),
      completed: false,
      isSubmitting: true,
    };

    setTodos(currentTodos => [...currentTodos, tempTodo]);

    setErrorMessage(''); // Clear error message if successful

    return createTodo(tempTodo)
      .then(newTodo => {
        setTodos(currentTodos =>
          currentTodos.map(todo => (todo.id === 0 ? newTodo : todo)),
        );
        setQuery('');
      })
      .catch(() => {
        setTodos(currentTodos => currentTodos.filter(todo => todo.id !== 0));
        setErrorMessage('Unable to add a todo');
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      })
      .finally(() => {
        inputRef.current?.focus();
        setIsSubmitting(false);
      });
  };

  const handleStatusChange = (value: TodoStatus) => {
    setStatus(value);
  };

  const filteredTodos = todos.filter(todo => {
    if (status === TodoStatus.Active) {
      return !todo.completed;
    }

    if (status === TodoStatus.Completed) {
      return todo.completed;
    }

    return true;
  });

  useEffect(() => {
    setLoading(true);
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const notCompletedTodos = todos.filter(
    todo => !todo.completed && !todo.isSubmitting,
  ).length;

  useEffect(() => {
    if (inputRef.current && !isSubmitting) {
      inputRef.current.focus();
    }
  }, [query, todos, isSubmitting]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header
          todos={filteredTodos}
          handleToggleAllClick={handleToggleAllClick}
          query={query}
          handleQueryChange={handleQueryChange}
          inputRef={inputRef}
          addTodo={addTodo}
        />

        <section className="todoapp__main" data-cy="TodoList">
          <div>
            {!loading && (
              <TodoList
                todos={filteredTodos}
                deleteThisTodo={deleteThisTodo}
                isChecked={isChecked}
                isSubmitting={false}
                isEdited={isEdited}
                setIsEdited={setIsEdited}
                handleCheckedChange={handleCheckedChange}
                handleTitleChange={handleTitleChange}
                selectedTodoId={selectedTodoId || 0}
                setSelectedTodoId={setSelectedTodoId}
                submitChangedTitle={submitChangedTitle}
              />
            )}
          </div>
        </section>

        {todos.length > 0 && (
          <div>
            <TodoFilter
              todos={filteredTodos}
              handleStatusChange={handleStatusChange}
              status={status}
              deleteThisTodo={deleteThisTodo}
              notCompletedTodos={notCompletedTodos}
            />
          </div>
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};

App.displayName = 'App';

export default React.memo(App);
