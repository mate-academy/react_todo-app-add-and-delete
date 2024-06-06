/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { client } from './utils/fetchClient';
import { Errors } from './utils/Errors/Errors';
import { Footer } from './utils/Footer/Footer';
import { Header } from './utils/Header/Header';
import { TodoList } from './utils/TodoList/TodoList';
import { deleteTodos, getTodos, patchTodos, postTodos } from './api/todos';

const USER_ID = 700;

enum Filter {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}

export const App: React.FC = () => {
  const [, setLoadingTodos] = useState<number[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string>('');
  const [filter, setFilter] = useState<string>('');
  const [newTodoTitle, setNewTodoTitle] = useState<string>('');
  const [allCompleted, setAllCompleted] = useState<boolean>(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const completedTodos = todos.filter(todo => todo.completed === false).length;

  const areAllCompleted =
    todos?.length > 0 && todos?.every(todo => todo.completed);

  // #region get
  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setError('Unable to load todos'));
  }, []);

  const getVisibleTodos = (generalTodos: Todo[], generalFilter: string) => {
    let filteredTodos = generalTodos;

    if (generalFilter === Filter.Active) {
      filteredTodos = filteredTodos.filter(todo => !todo.completed);
    } else if (generalFilter === Filter.Completed) {
      filteredTodos = filteredTodos.filter(todo => todo.completed);
    }

    return filteredTodos;
  };

  const visibleTodos = useMemo(() => {
    return getVisibleTodos(todos, filter);
  }, [todos, filter]);

  // #endregion

  //#region patchStatus
  const handleToggleAllCompleted = () => {
    const updatedTodos = todos.map(todo => ({
      ...todo,
      completed: !allCompleted,
    }));

    setTodos(updatedTodos);
    // Call API to update todos status
    updatedTodos.forEach(todo => {
      patchTodos(todo).catch(() => setError('Unable to update a todo'));
    });
    setAllCompleted(!allCompleted);
  };

  const handleTodoStatusChange = (id: number) => {
    const todoToUpdate = todos.find(todo => todo.id === id);

    if (!todoToUpdate) {
      return;
    }

    const updatedTodoStatus = {
      ...todoToUpdate,
      completed: !todoToUpdate.completed,
    };

    client
      .patch<Todo>(`/todos/${id}`, updatedTodoStatus)
      .then(updated => {
        setTodos(todos.map(todo => (todo.id === id ? updated : todo)));
      })
      .catch(() => setError('Unable to update a todo'));
  };

  // const handleEditTodo = (id) => {

  // };
  //#endregion

  //#region delete

  const handleDeleteTodo = (id: number) => {
    deleteTodos(id)
      .then(() => {
        setTodos(currentTodos => currentTodos.filter(todo => todo.id !== id));
      })
      .catch(() => setError('Unable to delete a todo'));
  };

  const handleClearCompleted = () => {
    const modifiedTodos = todos.filter(todo => todo.completed === true);

    Promise.all(modifiedTodos.map(todo => deleteTodos(todo.id)))
      .then(() => {
        setTodos(currentTodos => currentTodos.filter(todo => !todo.completed));
      })
      .catch(() => setError('Unable to delete completed todos'));
  };

  //#endregion

  //#region input/post

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoTitle(event.target.value);
  };

  const handleAddTodo = (event: React.FormEvent) => {
    event.preventDefault();

    if (!newTodoTitle.trim()) {
      setError('Title should not be empty');

      return;
    }

    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: newTodoTitle,
      completed: false,
    });

    setLoadingTodos(currentTodos => [...currentTodos, 0]);

    postTodos({
      title: newTodoTitle.trim(),
      userId: USER_ID,
      completed: false,
    })
      .then(addedTodo => {
        setTodos(prevTodos => [...prevTodos, addedTodo]);
        setNewTodoTitle('');
      })
      .catch(() => setError('Unable to add a todo'))
      .finally(() => {
        setLoadingTodos(currentTodos =>
          currentTodos.filter(todoId => todoId !== 0),
        );
        setTempTodo(null);
      });
  };

  //#endregion

  const handleErrorClose = () => {
    setError('');
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          handleToggleAllCompleted={handleToggleAllCompleted}
          areAllCompleted={areAllCompleted}
          handleAddTodo={handleAddTodo}
          handleInputChange={handleInputChange}
          newTodoTitle={newTodoTitle}
          tempTodo={tempTodo}
        />

        <TodoList
          visibleTodos={visibleTodos}
          handleDeleteTodo={handleDeleteTodo}
          handleTodoStatusChange={handleTodoStatusChange}
          tempTodo={tempTodo}
        />

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <Footer
            completedTodos={completedTodos}
            filter={filter}
            setFilter={setFilter}
            handleClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <Errors handleErrorClose={handleErrorClose} error={error} />
    </div>
  );
};
