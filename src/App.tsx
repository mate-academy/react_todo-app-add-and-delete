/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useMemo, useState } from 'react';
import cn from 'classnames';
import { UserWarning } from './UserWarning';
import {
  USER_ID,
  addTodo,
  getTodos,
  deleteTodo,
  updateTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import Header from './Cpmponents/Header';
import TodoList from './Cpmponents/TodoList';
import Footer from './Cpmponents/Footer';
import { Status } from './types/status';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodos, setTempTodos] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState(Status.all);
  const [errorMessage, setErrorMessage] = useState('');
  const [newTodo, setNewTodo] = useState('');
  const [inProcess, setInProcess] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setErrorMessage('');
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
        setTimeout(() => setErrorMessage(''), 3000);
      });
  }, []);

  const tasks = () => {
    const { active, completed } = Status;
    const allTodos = [...todos, ...tempTodos];

    switch (filterBy) {
      case active:
        return allTodos.filter(todo => !todo.completed);

      case completed:
        return allTodos.filter(todo => todo.completed);

      default:
        return allTodos;
    }
  };

  const allActive = useMemo(
    () => todos.filter(todo => !todo.completed).length,
    [todos],
  );

  const completedTask = todos.length > 0 && allActive === 0;
  const completedTodos = todos.filter(todo => todo.completed);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodo(e.target.value);
  };

  const handleAddTodo = () => {
    if (newTodo.trim()) {
      const tempTodo: Todo = {
        id: 0,
        title: newTodo,
        userId: USER_ID,
        completed: false,
      };

      setInProcess(prev => [...prev, tempTodo.id]);
      setTempTodos([...tempTodos, tempTodo]);
      setIsLoading(true);

      addTodo({
        title: newTodo.trim(),
        userId: USER_ID,
        completed: false,
      })
        .then((addedTodo: Todo) => {
          setTodos(prevTodos => [...prevTodos, addedTodo]);
          setTempTodos(prevTempTodos =>
            prevTempTodos.filter(todo => todo.id !== tempTodo.id),
          );
          setNewTodo('');
        })
        .catch(() => {
          setErrorMessage('Unable to add a todo');
          setTimeout(() => setErrorMessage(''), 3000);
          setTempTodos(prevTempTodos =>
            prevTempTodos.filter(todo => todo.id !== tempTodo.id),
          );
        })
        .finally(() => {
          setIsLoading(false);
          setTodos(prevTodos =>
            prevTodos.filter(todo => todo.id !== tempTodo.id),
          );
        });
    } else {
      setErrorMessage('Title should not be empty');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  const handleOnDelete = (todoId: number) => {
    setInProcess(prevInProcess => [...prevInProcess, todoId]);

    return deleteTodo(todoId)
      .then(() => {
        setTodos(toDoState => toDoState.filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
        setTimeout(() => setErrorMessage(''), 3000);
      })
      .finally(() => {
        setInProcess(prevInProcess =>
          prevInProcess.filter(id => id !== todoId),
        );
      });
  };

  const handleUpdate = (todoId: number, data: Partial<Todo>) => {
    setInProcess(prevInProcess => [...prevInProcess, todoId]);
    updateTodo(todoId, data)
      .then(() =>
        setTodos(current =>
          current.map(todo =>
            todo.id === todoId ? { ...todo, ...data } : todo,
          ),
        ),
      )
      .catch(() => {
        setErrorMessage('Unable to update a Todo');
        setTimeout(() => setErrorMessage(''), 3000);
      })
      .finally(() => {
        setInProcess(prevInProcess =>
          prevInProcess.filter(id => id !== todoId),
        );
      });
  };

  const deleteAllCompleted = () => {
    completedTodos.forEach(todo => handleOnDelete(todo.id));
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          completedTask={completedTask}
          handleChange={handleChange}
          handleAddTodo={handleAddTodo}
          todoTitle={newTodo}
          isLoading={isLoading}
          todos={todos}
        />
        <TodoList
          tasks={tasks()}
          handleOnDelete={handleOnDelete}
          inProcess={inProcess}
          handleUpdate={handleUpdate}
        />

        {!!todos.length && (
          <Footer
            filterBy={filterBy}
            setFilterBy={setFilterBy}
            deleteAllCompleted={deleteAllCompleted}
            activeTodos={allActive}
            completedTask={completedTodos}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !errorMessage },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
        />
        {errorMessage}
      </div>
    </div>
  );
};
