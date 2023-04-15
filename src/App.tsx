/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, addTodo, deleteTodo } from './api/todos';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';

const USER_ID = 7033;

function getVisibleTodos(todos: Todo[], currentFilter: string) {
  let visibleTodos = todos;

  if (currentFilter !== Filter.All) {
    visibleTodos = todos.filter(({ completed }) => {
      switch (currentFilter) {
        case Filter.Active:
          return !completed;
        case Filter.Completed:
          return completed;
        default:
          return true;
      }
    });
  }

  return visibleTodos;
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState<Filter>(Filter.All);
  const [errorMessage, setErrorMessage] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [title, setTitle] = useState('');
  const [loadingTodos, setLoadingTodos] = useState<number[]>([]);

  function clearError() {
    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  }

  const loadTodos = async () => {
    try {
      const todosFromServer = await getTodos(USER_ID);

      setTodos(todosFromServer);
    } catch (error) {
      setErrorMessage((error as Error).message);

      clearError();
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const visibleTodos = getVisibleTodos(todos, filterBy);

  const addNewTodo = async () => {
    try {
      if (title) {
        const newTodo = {
          id: 0,
          userId: USER_ID,
          title,
          completed: false,
        };

        setTempTodo(newTodo);
        setLoadingTodos(prev => [...prev, newTodo.id]);
        const addedTodo = await addTodo(USER_ID, newTodo);

        setTodos((current) => [...current, addedTodo]);
      } else {
        setErrorMessage('Title can\'t be empty');

        clearError();
      }
    } catch {
      setErrorMessage('Unable to add a todo');

      clearError();
    } finally {
      setTitle('');
      setTempTodo(null);
      setLoadingTodos([]);
    }
  };

  const removeTodoFromServer = async (todoId: number) => {
    setLoadingTodos(prev => [...prev, todoId]);

    try {
      setLoadingTodos(prev => [...prev, todoId]);
      await deleteTodo(todoId);
      setTodos((prevTodos) => {
        return prevTodos.filter(todo => todo.id !== todoId);
      });
    } catch {
      setErrorMessage('Unable to delete a todo');

      clearError();
    } finally {
      setLoadingTodos([]);
    }
  };

  const removeCompletedTodos = async () => {
    const completedTodoIds = visibleTodos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    try {
      setLoadingTodos(prev => [...prev, ...completedTodoIds]);
      await Promise.all(
        completedTodoIds.map(id => deleteTodo(id)),
      );
      setTodos((prevTodos) => {
        return prevTodos.filter(todo => !todo.completed);
      });
    } catch {
      setErrorMessage('Unable to delete completed todos');

      clearError();
    } finally {
      setLoadingTodos([]);
    }
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          title={title}
          setTitle={setTitle}
          onSaveNewTodo={addNewTodo}
          tempTodo={tempTodo}
        />

        {todos.length > 0 && (
          <>
            <TodoList
              todos={visibleTodos}
              tempTodo={tempTodo}
              onDeleteTodo={removeTodoFromServer}
              loadingTodos={loadingTodos}
            />
            <Footer
              todos={todos}
              filterBy={filterBy}
              onChangeFilter={setFilterBy}
              onDeleteCompletedTodos={removeCompletedTodos}
            />
          </>
        )}
      </div>

      <div
        className="notification is-danger is-light has-text-weight-normal"
        hidden={!errorMessage}
      >
        <button
          type="button"
          className="delete"
          onClick={() => {
            setErrorMessage('');
          }}
        />
        {errorMessage}
      </div>
    </div>
  );
};
