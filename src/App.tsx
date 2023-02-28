/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import {
  getTodos,
  addTodo,
  deleteTodo,
  completeTodo,
} from './api/todos';
import { Filter } from './types/Filter';
import { ErrorTypes } from './types/ErrorTypes';
import {
  Header, TodosList, Footer, ErrorNotifications,
} from './components';

const USER_ID = 6335;

export const App: React.FC = () => {
  const [allTodos, setAllTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<ErrorTypes | null>(null);
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [title, setTitle] = useState<string>('');
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [selectedTodoId, setSelectedTodoId] = useState(0);

  useEffect(() => {
    getTodos(USER_ID)
      .then(setAllTodos)
      .catch(() => {
        setError(ErrorTypes.Load);
        setTimeout(() => setError(null), 3000);
      });
  }, []);

  const filterHandler = (array: Todo[], filterType: string) => {
    switch (filterType) {
      case Filter.Active:
        return array.filter(item => !item.completed);
      case Filter.Completed:
        return array.filter(item => item.completed);
      default:
        return array;
    }
  };

  const addTodoHandler = () => {
    if (!title.trim()) {
      setError(ErrorTypes.Empty);
      setTimeout(() => setError(null), 3000);

      return;
    }

    setIsAdding(true);

    const todo = {
      title,
      userId: USER_ID,
      completed: false,
    };

    setTempTodo({
      id: 0,
      title,
      userId: USER_ID,
      completed: false,
    });

    addTodo(todo)
      .then(result => {
        setAllTodos(
          prevTodos => [...prevTodos, result],
        );
        setTempTodo(null);
      })
      .catch(() => {
        setError(ErrorTypes.Add);
        setTempTodo(null);
      })
      .finally(() => {
        setIsAdding(false);
        setTitle('');
        setTempTodo(null);
      });
  };

  const deleteTodoHandler = (id: number) => {
    deleteTodo(id)
      .then(() => setAllTodos(
        prevAllTodos => prevAllTodos.filter(prevTodo => prevTodo.id !== id),
      ))
      .catch(() => setError(ErrorTypes.Delete));
  };

  const activeTodos = useMemo(() => filterHandler(allTodos, Filter.Active), [allTodos]);
  const completedTodos = useMemo(() => filterHandler(allTodos, Filter.Completed), [allTodos]);
  const visibleTodos = useMemo(() => filterHandler(allTodos, filter), [allTodos, filter]);

  const deleteAllCompletedHandler = () => {
    completedTodos.forEach(completedTodo => deleteTodoHandler(completedTodo.id));
  };

  const todoStausChangeHandler = (id: number, data: boolean) => {
    completeTodo(id, data)
      .then(() => setAllTodos(prevTodos => {
        const changingTodo = prevTodos.find(todo => todo.id === id);

        if (changingTodo) {
          changingTodo.completed = data;
        }

        return [...prevTodos];
      }))
      .catch(() => setError(ErrorTypes.Update));
  };

  const completeAll = () => {
    if (allTodos.every(todo => todo.completed)) {
      allTodos.forEach(todo => todoStausChangeHandler(todo.id, false));
    } else {
      allTodos.forEach(todo => todoStausChangeHandler(todo.id, true));
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
          allTodos={allTodos}
          activeTodos={activeTodos}
          addTodoHandler={addTodoHandler}
          isAdding={isAdding}
          completeAll={completeAll}
        />
        {!!allTodos.length && (
          <>
            <TodosList
              todos={visibleTodos}
              tempTodo={tempTodo}
              deleteTodoHandler={deleteTodoHandler}
              selectedTodoId={selectedTodoId}
              setSelectedTodoId={setSelectedTodoId}
              todoStausChangeHandler={todoStausChangeHandler}
            />

            <Footer
              activeTodos={activeTodos}
              completedTodos={completedTodos}
              filter={filter}
              setFilter={setFilter}
              deleteAllCompletedHandler={deleteAllCompletedHandler}
            />
          </>
        )}
      </div>

      <ErrorNotifications
        error={error}
        setIsError={setError}
      />
    </div>
  );
};
