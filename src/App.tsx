/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect } from 'react';
import { UserWarning } from './UserWarning';
import { Loader } from './components/Loader';
import { FilterTypes } from './components/TodoFilter';
import { Todos } from './components/Todos';
import { Todo } from './types/Todo';
import { Footer } from './components/Footer';
import {
  deleteTodos, getTodos, patchTodos, postTodos,
} from './api/todos';

export const USER_ID = '10682';

export enum TodoErros {
  Add = 'Unable to add a todo',
  Delete = 'Unable to delete a todo',
  Update = 'Unable to update a todo',
  ErrorTodo = 'Can not find todos',
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState<string>('');
  const [tempTodoId, setTempTodoId] = useState<number | null>(null);
  const [filter, setFilter] = useState(FilterTypes.All);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    setIsLoading(true);

    getTodos(USER_ID).then(
      fetchedTodos => {
        setTodos(fetchedTodos as Todo[]);
        setIsLoading(false);
      },
    ).catch(() => {
      setError(TodoErros.ErrorTodo);
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

      postTodos(USER_ID, newTodo).then((todo) => {
        const receivedTodo = todo as Todo;

        setTempTodoId(receivedTodo.id);

        setTodos((prevTodos) => [...prevTodos, receivedTodo]);
        setInput('');
        setTempTodoId(null);

        if (error && error === TodoErros.Add) {
          setError('');
        }
      }).catch(() => {
        setError(TodoErros.Add);
      });
    }
  };

  const handleRemoveTodo = (todoId: number) => {
    setTempTodoId(todoId);
    deleteTodos(USER_ID, todoId).then(() => {
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
      setTempTodoId(null);

      if (error && error === TodoErros.Delete) {
        setError('');
      }
    }).catch(() => setError(TodoErros.Delete));
  };

  const removeCompletedTodos = () => {
    todos.filter(todo => todo.completed === true)
      .map(currentTodo => deleteTodos(USER_ID, currentTodo.id)
        .then(() => {
          setTodos(prevTodos => prevTodos
            .filter(todo => todo.completed === false));

          if (error && error === TodoErros.Delete) {
            setError('');
          }
        }).catch(() => {
          setError(TodoErros.Delete);
        }));
  };

  const handleCheckBoxTodo = (todoId: number) => {
    const curentTodo: Todo | undefined = todos.find(todo => todo.id === todoId);

    if (!curentTodo) {
      return;
    }

    patchTodos(todoId, USER_ID, curentTodo).then(() => {
      setTodos(prevTodos => prevTodos.map(
        todo => {
          if (todo.id === todoId) {
            return {
              ...todo,
              completed: !todo.completed,
            };
          }

          if (error && error === TodoErros.Update) {
            setError('');
          }

          return todo;
        },
      ));
    }).catch(() => {
      setError(TodoErros.Update);
    });
  };

  const handleChackAllTodos = () => {
    setTodos(currentTodos => currentTodos
      .map(
        currentTodo => {
          return {
            ...currentTodo,
            completed: true,
          };
        },
      ));

    if (todos.every(currTodo => currTodo.completed === true)) {
      setTodos(currentTodos => currentTodos
        .map(
          currentTodo => {
            return {
              ...currentTodo,
              completed: !currentTodo.completed,
            };
          },
        ));
    }
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
        <header className="todoapp__header">
          <button
            type="button"
            className={`todoapp__toggle-all ${todos.length > 0 && 'active'}`}
            onClick={handleChackAllTodos}
          />

          <form onSubmit={handleAddTodo}>
            <input
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={input}
              onChange={handleImputTodo}
            />
          </form>
        </header>

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
