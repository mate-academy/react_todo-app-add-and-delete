/* eslint-disable prettier/prettier */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import * as todoService from './api/todos';
import { Header } from './components/TodoHeader';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';
import { Error } from './components/Error';

enum Status {
  all = 'all',
  active = 'active',
  completed = 'completed',
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [statusFilter, setStatusFilter] = useState<Status>(Status.all);
  const [title, setTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);
  const [isErrorVisible, setIsErrorVisible] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  // const [loading, setLoading] = useState(false);

  const inputRef = React.useRef<HTMLInputElement>(null);

  const visibleTodos = todos.filter(todo => {
    if (statusFilter === Status.active) {
      return !todo.completed;
    }

    if (statusFilter === Status.completed) {
      return todo.completed;
    }

    return true;
  });

  const activeTodos = todos.filter(
    todo => !todo.completed && !loadingTodoIds.includes(todo.id),
  );

  useEffect(() => {
    setLoadingTodoIds([]);
    // setLoading(true);

    todoService
      .getTodos()
      .then(loadedTodos => {
        setTodos(loadedTodos);
      })
      .catch(() => {
        setErrorMessage('Unable to load todos');
      })
      .finally(() => {
        // setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!errorMessage) {
      setIsErrorVisible(false);

      return;
    }

    setIsErrorVisible(true);

    const hideTimer = setTimeout(() => {
      setIsErrorVisible(false);
    }, 3000);

    const clearTimer = setTimeout(() => {
      setErrorMessage('');
    }, 3300);

    return () => {
      clearTimeout(hideTimer);
      clearTimeout(clearTimer);
    };
  }, [errorMessage]);

  useEffect(() => {
    if (!isDisabled) {
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    }
  }, [isDisabled]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  function startLoading(id: number) {
    setLoadingTodoIds(ids => [...ids, id]);
  }

  function stopLoading(id: number) {
    setLoadingTodoIds(ids => ids.filter(x => x !== id));
  }

  async function addTodo(todoTitle: string): Promise<void> {
    setErrorMessage('');
    setIsDisabled(true);

    const tempId = Date.now();

    startLoading(tempId);

    setTodos(current => [
      ...current,
      {
        id: tempId,
        title: todoTitle,
        completed: false,
        userId: USER_ID,
      },
    ]);

    return todoService
      .createTodo({ title: todoTitle })
      .then(newTodo => {
        setTodos(currentTodos =>
          currentTodos.map(todo => (todo.id === tempId ? newTodo : todo)),
        );
      })
      .catch(error => {
        setTodos(current => current.filter(todo => todo.id !== tempId));
        setErrorMessage('Unable to add a todo');
        throw error;
      })
      .finally(() => {
        setTimeout(() => stopLoading(tempId));
        setIsDisabled(false);
      });
  }

  async function updateTodo(id: number, completed: boolean): Promise<void> {
    setErrorMessage('');
    startLoading(id);

    return todoService
      .updateTodo({ id, completed })
      .then(updatedTodo => {
        setTodos(currentTodos => {
          return currentTodos.map(todo =>
            todo.id === updatedTodo.id ? updatedTodo : todo,
          );
        });
      })
      .catch(() => {
        setErrorMessage('Unable to update a todo');
      })
      .finally(() => {
        setTimeout(() => stopLoading(id));
      });
  }

  async function deleteTodo(todoId: number) {
    setErrorMessage('');
    startLoading(todoId);
    setIsDisabled(true);

    return todoService
      .deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
      })
      .finally(() => {
        setTimeout(() => stopLoading(todoId));
        setIsDisabled(false);
      });
  }

  function clearCompleted() {
    const completedTodos = todos.filter(todo => todo.completed);

    setIsDisabled(true);

    completedTodos.forEach(todo => {
      startLoading(todo.id);

      todoService
        .deleteTodo(todo.id)
        .then(() => {
          setTodos(currentTodos => currentTodos.filter(t => t.id !== todo.id));
        })
        .catch(() => {
          setErrorMessage('Unable to delete a todo');
        })
        .finally(() => {
          setTimeout(() => stopLoading(todo.id));
          setIsDisabled(false);
        });
    });
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    setErrorMessage('');

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setErrorMessage('Title should not be empty');

      return;
    }

    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    addTodo(trimmedTitle)
      .then(() => {
        setTitle('');
      })
      .catch(() => {})
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const onComplete = async (todo: Todo) => {
    try {
      await updateTodo(todo.id, !todo.completed);
    } catch (error) {}
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header
          todos={todos}
          ref={inputRef}
          inputValue={title}
          isDisabled={isDisabled}
          isSubmitting={isSubmitting}
          onChangeText={setTitle}
          updateTodo={updateTodo}
          onSubmit={handleSubmit}
        />

        <TodoList
          todos={visibleTodos}
          loadingTodoIds={loadingTodoIds}
          onChange={onComplete}
          onRemove={deleteTodo}
        />

        {todos.length !== 0 && (
          <TodoFooter
            todos={todos}
            activeTodos={activeTodos}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            clearCompleted={clearCompleted}
          />
        )}
      </div>

      <Error
        message={errorMessage}
        visible={isErrorVisible}
        onHide={() => setIsErrorVisible(false)}
      />
    </div>
  );
};
