/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import {
  createTodo, deleteTodo, getTodo, getTodos, updateTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import { UserWarning } from './UserWarning';
import { Todos } from './components/Todos';
import { Main } from './components/Main';
import { Footer } from './components/Footer';
import { Errors } from './components/Errors';
import { Filters, filterTodos } from './utils/filters';
import { ErrorMessage, Timeout } from './utils/ErrorsMessages';

const USER_ID = 6277;

export const App: React.FC = () => {
  const [processedTodos, setProcessedTodos] = useState<number[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todo, setTodo] = useState<Todo | null>(null);
  const [error, setError] = useState(false);
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
          setErrorMsg('');
        }, Timeout);
      });
  }, []);

  useEffect(() => {
    if (todo) {
      getTodo(todo.id).then(setTodo);
    }
  }, [todo]);

  const handleError = (message: string) => {
    setError(true);
    setErrorMsg(message);

    setTimeout(() => {
      setError(false);
      setErrorMsg('');
    }, Timeout);
  };

  const addTodo = (todoData: Omit<Todo, 'id'>) => {
    if (!todoData.title) {
      handleError(ErrorMessage.Empty);

      return;
    }

    setProcessedTodos(prev => [...prev, 0]);
    setTodos([...todos, { ...todoData, id: 0 }]);
    createTodo(todoData)
      .then(newTodo => setTodos([...todos, newTodo]))
      .catch(() => handleError(ErrorMessage.Adding))
      .finally(() => {
        setTodos(prev => prev.filter(td => td.id !== 0));
      });
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

  const handleDelete = (id: number) => {
    setProcessedTodos(prev => [...prev, id]);
    deleteTodo(id)
      .then(() => setTodos(todos.filter(td => td.id !== id)))
      .catch(() => handleError(ErrorMessage.Deleting))
      .finally(() => setProcessedTodos(prev => prev.filter(tid => tid !== id)));
  };

  const handleUpdate = (todoToUpdate: Todo) => {
    setProcessedTodos(prev => [...prev, todoToUpdate.id]);
    updateTodo(todoToUpdate)
      .then(() => setTodos(todos.map(
        td => (td.id === todoToUpdate.id ? todoToUpdate : td),
      )))
      .catch(() => handleError(ErrorMessage.Updating))
      .finally(() => setProcessedTodos(prev => prev.filter(
        tid => tid !== todoToUpdate.id,
      )));
  };

  const handleToggleAll = () => {
    const allCompleted = todos.every(td => td.completed);
    const updatedTodos = todos.map(td => ({ ...td, completed: !allCompleted }));

    setTodos(updatedTodos);
  };

  const completedTodos = todos.filter(td => td.completed);
  const visibleTodos = filterTodos(todos, filter);
  const removeTodo = handleDelete;
  const todoUpdate = handleUpdate;
  const clearCompleted = () => {
    const promises = completedTodos.map((td) => {
      setProcessedTodos((prev) => [...prev, td.id]);

      return deleteTodo(td.id)
        .then(() => setTodos(todos.filter((t) => t.id !== td.id)));
    });

    return Promise.all(promises);
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Todos
          onSubmit={handleSubmit}
          newTodoTitle={newTodoTitle}
          setNewTodoTitle={setNewTodoTitle}
          allCompleted={completedTodos.length === todos.length}
          onhandleToggleAll={handleToggleAll}
        />

        {todos.length > 0 && (
          <>
            <Main
              todos={visibleTodos}
              onRemove={removeTodo}
              onTodoUpdate={todoUpdate}
              processedTodos={processedTodos}
            />

            <Footer
              todos={todos}
              filter={filter}
              setFilter={setFilter}
              onClearCompleted={clearCompleted}
            />
          </>
        )}
      </div>

      {error && (
        <Errors errorMsg={errorMsg} error={error} setError={setError} />)}
    </div>
  );
};
