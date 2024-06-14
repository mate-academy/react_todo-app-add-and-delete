/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { USER_ID, deleteTodo, getTodos } from '../src/components/api/todos';
import { TodoList } from './components/ToDoList';
import { TodoHeader } from './components/ToDoHeader';
import { TodoFooter } from './components/ToDoFooter';
import { Error } from './components/Error';
import { type Todo } from './types/Todo';
import { createTodo } from '../src/components/api/todos';
import { FilterButtons } from './types/FilterType';
import { Errors } from './types/EnumedErrors';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<Errors>(Errors.NoLetters);
  const [temporaryTodo, setTemporaryTodo] = useState<Todo | null>(null);
  const [tempIds, setTempIds] = useState<number[]>([]);
  const [newToDoTitle, setNewToDoTitle] = useState('');
  const [filterButton, setFilterButton] = useState<FilterButtons>(
    FilterButtons.All,
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleError = (errorsTexts: Errors) => {
    setError(errorsTexts);
  };

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setError(Errors.UnableToLoad);
        setTimeout(() => {
          setError(Errors.NoLetters);
        }, 3000);
      });
  }, [error]);

  const handleAddingTodos = (event: React.FormEvent<Element>) => {
    event.preventDefault();
    if (!newToDoTitle.trim()) {
      setError(Errors.TitleEmpty);

      return;
    }

    setIsLoading(true);

    const createdTodo = {
      id: 0,
      userId: USER_ID,
      title: newToDoTitle.trim(),
      completed: false,
      editted: false,
    };

    setTemporaryTodo(createdTodo);
    setTempIds(currentIds => [...currentIds, 0]);

    return createTodo(createdTodo)
      .then(curTodo => {
        setTodos([...todos, curTodo]);
        setNewToDoTitle('');
      })
      .catch(() => {
        setError(Errors.UnableToAdd);
        setTimeout(() => {
          setError(Errors.NoLetters);
        }, 3000);
      })
      .finally(() => {
        setTemporaryTodo(null);
        setTempIds([]);
        setIsLoading(false);
      });
  };

  const handleDeletedTodo = (idNumber: number) => {
    setIsLoading(true);
    setTempIds(currentIds => [...currentIds, idNumber]);

    return deleteTodo(idNumber)
      .then(() => {
        setTodos(currTodos => currTodos.filter(todo => todo.id !== idNumber));
      })
      .catch(() => {
        setError(Errors.UnableToDelete);
        setTimeout(() => {
          setError(Errors.NoLetters);
        }, 3000);
      })
      .finally(() => {
        setTempIds([]);
        setIsLoading(false);
      });
  };

  const completedTodos = todos.filter(todo => todo.completed);

  const deleteOnlyCompleted = () => {
    completedTodos.forEach(todo => handleDeletedTodo(todo.id));
  };

  const allTodosAreCompleted =
    todos.filter(todo => todo.completed).length === todos.length;

  const handleChangingStatusButton = () => {
    if (allTodosAreCompleted) {
      const changeTodos: Todo[] = todos.map(todo => {
        return {
          ...todo,
          completed: false,
        };
      });

      setTodos(changeTodos);
    } else {
      const changeTodo = todos.map(todo => {
        return {
          ...todo,
          completed: true,
        };
      });

      setTodos(changeTodo);
    }
  };

  const onlyActiveTodos = todos.filter(todo => !todo.completed);

  const todosCounter =
    todos.length === 1 ? '1 item' : `${onlyActiveTodos.length} items left`;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        {' '}
        <TodoHeader
          addTodos={handleAddingTodos}
          toggleButton={handleChangingStatusButton}
          todos={todos}
          allTodosAreCompleted={allTodosAreCompleted}
          toDoTitle={newToDoTitle}
          setToDoTitle={setNewToDoTitle}
          isLoading={isLoading}
        />
        <TodoList
          todos={todos}
          filter={filterButton}
          deleteTodo={handleDeletedTodo}
          loadingTodos={tempIds}
          temporaryTodo={temporaryTodo}
        />
        <TodoFooter
          todos={todos}
          filter={filterButton}
          setFilter={setFilterButton}
          todosCounter={todosCounter}
          deletedAllCompleted={deleteOnlyCompleted}
        />
      </div>

      <Error error={error} setError={handleError} />
    </div>
  );
};
