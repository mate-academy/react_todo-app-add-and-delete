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

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState('');
  const [temporaryTodo, setTemporaryTodo] = useState<Todo | null>(null);
  const [tempIds, setTempIds] = useState<number[]>([]);
  const [newToDoTitle, setNewToDoTitle] = useState('');
  const [filterButton, setFilterButton] = useState<FilterButtons>(
    FilterButtons.All,
  );

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setError('Unable to load todos');
      });
  }, []);

  const handleAddingTodos = (event: React.FormEvent<Element>) => {
    event.preventDefault();
    if (!newToDoTitle.trim()) {
      setError('Title should not be empty');

      return;
    }

    const createdTodo = {
      id: 0,
      userId: USER_ID,
      title: newToDoTitle,
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
        setError('Unable to add a todo');
      })
      .finally(() => {
        setTemporaryTodo(null);
        setTempIds(currentIds => currentIds.filter(todoId => todoId !== 0));
      });
  };

  const handleDeletedTodo = (idNumber: number) => {
    setTempIds(currentIds => [...currentIds, idNumber]);

    return deleteTodo(idNumber)
      .then(() => {
        setTodos(updateTodos =>
          updateTodos.filter(todo => todo.id !== idNumber),
        );
      })
      .catch(() => {
        setError('Unable to delete a todo');
      })
      .finally(() => {
        setTempIds(currentIds =>
          currentIds.filter(deletedId => idNumber !== deletedId),
        );
      });
  };

  const deleteOnlyCompleted = () => {
    const removeDeletedTodos = todos.filter(todo => !todo.completed);

    setTodos(removeDeletedTodos);
  };

  const filteredTodos = (
    filtrTodos: Todo[],
    filterStatus: FilterButtons,
  ): Todo[] => {
    const updateTodos = [...filtrTodos];

    if (filterStatus) {
      switch (filterStatus) {
        case FilterButtons.Active:
          return updateTodos.filter(todo => !todo.completed);
        case FilterButtons.Completed:
          return updateTodos.filter(todo => todo.completed);
        default:
          break;
      }
    }

    return updateTodos;
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
    todos.length === 1
      ? 'one item left'
      : `${onlyActiveTodos.length} items left`;

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
          error={error}
        />
        <TodoList
          todos={todos}
          filteredTodos={filteredTodos}
          filter={filterButton}
          deleteTodo={handleDeletedTodo}
          loadingTodos={tempIds}
          temporaryTodo={temporaryTodo}
        />
        <TodoFooter
          todos={todos}
          filter={filterButton}
          setFilter={setFilterButton}
          deleteAllCompleted={deleteOnlyCompleted}
          todosCounter={todosCounter}
        />
      </div>

      <Error error={error} setError={setError} />
    </div>
  );
};
