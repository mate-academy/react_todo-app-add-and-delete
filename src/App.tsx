/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { dataTodos, USER_ID } from './api/todos';
import { Filter, Todo } from './types/Todo';
import { Header } from './Components/Header';
import { TodoList } from './Components/TodoList';
import { Footer } from './Components/Footer';
import { ErrorMessage } from './Components/ErrorMessage';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [todoTitle, setTodoTitle] = useState<string>('');
  const [filter, setFilter] = useState(Filter.All);
  const [loadingAllTodos, setLoadingAllTodos] = useState<boolean>(false);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[] | null>(null);
  const [editingTitle, setEditingTitle] = useState<string>('');
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    dataTodos
      .getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
      });
  }, []);

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case Filter.All:
        return todos;
      case Filter.Active:
        return todos.filter(todo => !todo.completed);
      case Filter.Completed:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  function deleteTodo(todoId: number) {
    setLoadingTodoIds(prevIds => {
      return prevIds ? [...prevIds, todoId] : [todoId];
    });
    setErrorMessage('');

    return dataTodos
      .deleteTodos(todoId)
      .then(() => {
        setTodos(todos.filter(todo => todo.id !== todoId));

        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.focus();
          }
        }, 0);
      })
      .catch(error => {
        setErrorMessage('Unable to delete a todo');
        throw error;
      })
      .finally(() => {
        setLoadingTodoIds(null);
      });
  }

  function updateTodo(updatedTodo: Todo) {
    setErrorMessage('');
    setLoadingTodoIds([updatedTodo.id]);

    return dataTodos
      .updateTodos(updatedTodo)
      .then(todo => {
        setTodos(currentTodos => {
          const newTodos = [...currentTodos];
          const index = newTodos.findIndex(t => t.id === todo.id);

          newTodos.splice(index, 1, todo);

          return newTodos;
        });
      })
      .catch(error => {
        setErrorMessage('Unable to update a todo');
        throw error;
      })
      .finally(() => {
        setLoadingTodoIds(null);
        setLoadingAllTodos(false);
      });
  }

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage('');
      }, 3000);

      return () => {
        clearTimeout(timer);
      };
    }

    return undefined;
  }, [errorMessage]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          setTodos={setTodos}
          setErrorMessage={setErrorMessage}
          loadingTodoIds={loadingTodoIds}
          setLoadingTodoIds={setLoadingTodoIds}
          updateTodo={updateTodo}
          inputRef={inputRef}
          todoTitle={todoTitle}
          setTodoTitle={setTodoTitle}
        />
        <TodoList
          loadingTodoIds={loadingTodoIds}
          setLoadingTodoIds={setLoadingTodoIds}
          loadingAllTodos={loadingAllTodos}
          setErrorMessage={setErrorMessage}
          setTodos={setTodos}
          todos={todos}
          inputRef={inputRef}
          updateTodo={updateTodo}
          editingTitle={editingTitle}
          setEditingTitle={setEditingTitle}
          editingTodoId={editingTodoId}
          setEditingTodoId={setEditingTodoId}
          filteredTodos={filteredTodos}
          deleteTodo={deleteTodo}
        />

        {todos.length > 0 && (
          <Footer
            setLoadingTodoIds={setLoadingTodoIds}
            deleteTodo={deleteTodo}
            setErrorMessage={setErrorMessage}
            todos={todos}
            setTodos={setTodos}
            inputRef={inputRef}
            filter={filter}
            setFilter={setFilter}
          />
        )}
      </div>
      <ErrorMessage
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
