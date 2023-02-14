/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import {
  createTodo,
  deleteTodo,
  getTodos,
  updateTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import { UserWarning } from './UserWarning';
import { Main } from './components/Main';
import { Footer } from './components/Footer';
import { Errors } from './components/Errors';
import { Todos } from './components/Todos';

const USER_ID = 6277;

enum Filters {
  Active = 'active',
  Completed = 'completed',
  All = 'all',
}

enum ErrorMessage {
  Loading = 'Unable to load todos',
  Adding = 'Unable to add todo',
  Deleting = 'Unable to delete todo',
  Updating = 'Unable to update todo',
  Empty = 'Title cant be empty',
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [filter, setFilter] = useState<Filters>(Filters.All);
  const [newTodoTitle, setNewTodoTitle] = useState('');

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setError(true);
        setErrorMsg(ErrorMessage.Loading);

        setTimeout(() => {
          setError(false);
        }, 3000);
      });
  }, []);

  const addTodo = (todoData: Omit<Todo, 'id'>) => {
    createTodo(todoData)
      .then(newTodo => setTodos([...todos, newTodo]))
      .catch(() => setErrorMsg(ErrorMessage.Adding));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    addTodo({
      title: newTodoTitle,
      completed: false,
      userId: USER_ID,
    });

    setNewTodoTitle('');
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  const visibleTodos = todos.filter((td) => {
    switch (filter) {
      case Filters.Active:
        return !td.completed;
      case Filters.Completed:
        return td.completed;
      default:
        return true;
    }
  });

  const removeTodo = async (todoId: number) => {
    try {
      await deleteTodo(todoId);
      setTodos(todos.filter(td => td.id !== todoId));
    } catch {
      setErrorMsg(ErrorMessage.Deleting);
    }
  };

  const todoUpdate = async (todoToUpdate: Todo) => {
    try {
      await updateTodo(todoToUpdate);
      setTodos(
        todos.map(td => {
          if (td.id === todoToUpdate.id) {
            return todoToUpdate;
          }

          return td;
        }),
      );
    } catch {
      setErrorMsg(ErrorMessage.Updating);
    }
  };

  const completedTodos = todos.filter(td => td.completed);
  const clearCompleted = () => {
    completedTodos.forEach(td => {
      removeTodo(td.id);
    });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Todos
          todos={visibleTodos}
          onSubmit={handleSubmit}
          newTodoTitle={newTodoTitle}
          setNewTodoTitle={setNewTodoTitle}
        />
        {todos.length > 0 && (
          <Main
            todos={visibleTodos}
            onRemove={removeTodo}
            onTodoUpdate={todoUpdate}
          />
        )}

        {todos.length > 0 && (
          <Footer
            todos={todos}
            filter={filter}
            setFilter={setFilter}
            onClearCompleted={clearCompleted}
          />
        )}
      </div>

      {error && (
        <Errors errorMsg={errorMsg} error={error} setError={setError} />)}
    </div>
  );
};
