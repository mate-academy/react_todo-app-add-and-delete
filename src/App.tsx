/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect } from 'react';
import { UserWarning } from './UserWarning';
import { Loader } from './components/Loader';
import { FilterTypes } from './components/TodoFilter';
import { Todos } from './components/Todos';
import { Todo } from './types/Todo';
import { Footer } from './components/Footer';
import {
  deleteTodos,
  getTodos,
  patchTodos,
  postTodos,
} from './api/todos';
import { TodoErrors } from './types/Errors';
import { Header } from './components/Header/Header';

export const USER_ID = '10682';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState<string>('');
  const [tempTodoId, setTempTodoId] = useState<number | null>(null);
  const [filter, setFilter] = useState(FilterTypes.All);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const [temporaryNewTodo, setTemporaryNewTodo] = useState<Todo | null>(null);

  useEffect(() => {
    setIsLoading(true);

    getTodos(USER_ID).then(
      fetchedTodos => {
        setTodos(fetchedTodos as Todo[]);
        setIsLoading(false);
      },
    ).catch(() => {
      setError(TodoErrors.ErrorTodo);
    });
  }, []);

  const handleImputTodo = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setInput(e.target.value);
  };

  const handleAddTodo = (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    if (input.trim()) {
      const newTodo: Omit<Todo, 'id'> = {
        userId: Number(USER_ID),
        title: input,
        completed: false,
      };

      setTemporaryNewTodo({ ...newTodo, id: 1 });

      postTodos(USER_ID, newTodo).then((todo) => {
        const receivedTodo = todo as Todo;

        setTodos((prevTodos) => [...prevTodos, receivedTodo]);
        setInput('');

        if (error && error === TodoErrors.Add) {
          setError('');
        }
      }).catch(() => {
        setError(TodoErrors.Add);
      }).finally(() => setTemporaryNewTodo(null));
    }
  };

  const handleRemoveTodo = (todoId: number) => {
    setTempTodoId(todoId);
    deleteTodos(USER_ID, todoId).then(() => {
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
      setTempTodoId(null);

      if (error && error === TodoErrors.Delete) {
        setError('');
      }
    }).catch(() => setError(TodoErrors.Delete));
  };

  const removeCompletedTodos = () => {
    todos.filter(todo => todo.completed === true)
      .map(currentTodo => deleteTodos(USER_ID, currentTodo.id)
        .then(() => {
          setTodos(prevTodos => prevTodos
            .filter(todo => todo.completed === false));

          if (error && error === TodoErrors.Delete) {
            setError('');
          }
        }).catch(() => {
          setError(TodoErrors.Delete);
        }));
  };

  const handleCheckBoxTodo = async (todoId: number) => {
    const curentTodo: Todo | undefined = todos.find(todo => todo.id === todoId);

    if (!curentTodo) {
      return;
    }

    const updatedTodos = todos.map(todo => {
      if (todo.id === todoId) {
        return {
          ...todo,
          completed: !todo.completed,
        };
      }

      if (error && error === TodoErrors.Update) {
        setError('');
      }

      return todo;
    });

    setTodos(updatedTodos);

    await Promise.all(updatedTodos.map(async (todo) => {
      await patchTodos(USER_ID, todo).catch(() => {
        setError(TodoErrors.Update);
      });
    }));
  };

  const handleChackAllTodos = async () => {
    let updatedTodos = [];

    if (todos.every(currTodo => currTodo.completed === true)) {
      updatedTodos = todos.map(
        currentTodo => {
          return {
            ...currentTodo,
            completed: !currentTodo.completed,
          };
        },
      );
    } else {
      updatedTodos = todos.map(
        currentTodo => {
          return {
            ...currentTodo,
            completed: true,
          };
        },
      );
    }

    setTodos(updatedTodos);

    await Promise.all(updatedTodos.map(async (todo) => {
      await patchTodos(USER_ID, todo).catch(() => {
        setError(TodoErrors.Update);
      });
    }));
  };

  const filteredTodos = filter === FilterTypes.All
    ? todos
    : todos.filter((todo) => {
      if (filter === FilterTypes.Completed) {
        return todo.completed;
      }

      return !todo.completed;
    });

  const filterTodos = (
    type: FilterTypes,
  ) => {
    setFilter(type);
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          input={input}
          addTodo={handleAddTodo}
          onCheckAllTodos={handleChackAllTodos}
          handleImputTodo={handleImputTodo}
        />

        {isLoading
          ? <Loader />
          : (
            <Todos
              error={error}
              todos={filteredTodos}
              onRemoveTodo={handleRemoveTodo}
              onCheckedTodo={handleCheckBoxTodo}
              tempTodoId={tempTodoId}
              handleImputTodo={handleImputTodo}
              temporaryNewTodo={temporaryNewTodo}
            />
          )}
        {!!todos.length && (
          <Footer
            todos={todos}
            onFilterType={filterTodos}
            filter={filter}
            onRemoveTodos={removeCompletedTodos}
          />
        )}
      </div>

      {error && (
        <div className="notification is-danger is-light has-text-weight-normal">
          <button type="button" className="delete" />

          {error}
        </div>
      )}
    </div>
  );
};
