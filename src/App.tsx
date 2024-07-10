/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import * as todoService from './api/todos';
import { Todo } from './types/Todo';
import { FilterType } from './types/FilterTodos';
import { List } from './components/Todolist';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Error } from './components/Error';

export const App: React.FC = () => {
  const [title, setTitle] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [filter, setFilter] = useState(FilterType.all);
  const [showUpdateInput, setShowUpdateInput] = useState(false);
  const [disable, setDisable] = useState(false);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);
  const allCompleted = todos.every(todo => todo.completed);

  useEffect(() => {
    setLoading(true);
    todoService
      .getTodos()
      .then(todoFromServer => setTodos(todoFromServer))
      .catch(() => {
        setErrorMessage('Unable to load todos');
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const timer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (error) {
      timer.current = setTimeout(() => {
        setError(false);
      }, 3000);
    }

    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
    };
  }, [error]);

  if (!todoService.USER_ID) {
    return <UserWarning />;
  }

  const filterTodos = todos.filter(todo => {
    switch (filter) {
      case FilterType.active:
        return !todo.completed;
      case FilterType.completed:
        return todo.completed;
      default:
        return true;
    }
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (title.trim() === '') {
      setErrorMessage('Title should not be empty');
      setError(true);

      return;
    }

    setDisable(true);
    let requestSuccessful = false;
    const temptodo: Todo = {
      userId: todoService.USER_ID,
      title: title.trimStart().trimEnd(),
      completed: false,
      id: 0,
    };

    setLoadingTodoIds(prev => [...prev, temptodo.id]);
    setTempTodo(temptodo);
    todoService
      .createTodo(temptodo)
      .then(createdTodo => {
        setTodos(currentTodos => [...currentTodos, createdTodo]);
        requestSuccessful = true;
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
        setError(true);
        setTitle(title);
      })
      .finally(() => {
        setDisable(false);
        setLoadingTodoIds(prev => prev.filter(id => id !== temptodo.id));
        setTempTodo(null);
        if (requestSuccessful) {
          setTitle('');
        }
      });
  };

  const handleComplitedToDo = (upTodo: Todo) => {
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const { id, title, completed } = upTodo;

    setLoadingTodoIds(prev => [...prev, id]);

    todoService
      .upDataTodo({ id, title, completed: !completed })
      .then(() => {
        setTodos(
          todos.map(todo =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo,
          ),
        );
      })
      .finally(() => {
        setLoadingTodoIds(prev => prev.filter(todoId => todoId !== id));
      });
  };

  const deleteTodo = (id: number) => {
    setLoadingTodoIds(prev => [...prev, id]);
    todoService
      .deleteTodo(id)
      .then(() => {
        setTodos(todos.filter(todo => todo.id !== id));
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
        setError(true);
      })
      .finally(() => {
        setLoadingTodoIds(prev => prev.filter(todoId => todoId !== id));
      });
  };

  const closeErrorNotification = () => {
    setError(false);
  };

  const clearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    Promise.all(
      completedTodos.map(todo => {
        setLoadingTodoIds(prev => [...prev, todo.id]);

        return todoService
          .deleteTodo(todo.id)
          .then(() => {
            setTodos(currentTodos =>
              currentTodos.filter(t => t.id !== todo.id),
            );
          })
          .catch(() => {
            setErrorMessage('Unable to delete a todo');
            setError(true);
          })
          .finally(() => {
            setLoadingTodoIds(prev =>
              prev.filter(todoId => todoId !== todo.id),
            );
          });
      }),
    );
  };

  const updateTodo = (todo: Todo) => {
    // eslint-disable-next-line no-console
    console.log(todo);
    setShowUpdateInput(true);
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header
          title={title}
          setTitle={setTitle}
          handleSubmit={handleSubmit}
          disable={disable}
          todos={todos}
          allCompleted={allCompleted}
        />
        <List
          todos={filterTodos}
          tempTodo={tempTodo}
          loadingTodoIds={loadingTodoIds}
          showUpdateInput={showUpdateInput}
          loading={loading}
          handleCompletedTodo={handleComplitedToDo}
          deleteTodo={deleteTodo}
          updateTodo={updateTodo}
        />

        {!!todos.length && (
          <Footer
            todos={todos}
            clearCompleted={clearCompleted}
            filter={filter}
            setFilter={setFilter}
          />
        )}
      </div>

      <Error
        error={error}
        errorMessage={errorMessage}
        closeErrorNotification={closeErrorNotification}
      />
    </div>
  );
};
