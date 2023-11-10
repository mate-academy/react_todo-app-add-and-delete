/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { Todo } from './types/Todo';

import { TodoForm } from './components/TodoForm';
import { TodoList } from './components/TodoList';
import { TodoFilter } from './components/TodoFilter';
import { Filter } from './types/Filter';
import { ErrorMessage } from './components/ErrorMessage';
import {
  USER_ID, createTodo, deleteTodo, getTodos,
} from './api/todos';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [modifyingTodoIds, setModifyingTodoIds] = useState<Array<number>>([]);
  const [filterBy, setFilterBy] = useState<Filter>(Filter.All);

  const loadTodos = async () => {
    try {
      const todosData = await getTodos();

      setTodos(todosData);
    } catch (error) {
      setErrorMessage('Unable to load todos');
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const filteredTodos = todos.filter((todo) => {
    switch (filterBy) {
      case Filter.Active:
        return !todo.completed;

      case Filter.Completed:
        return todo.completed;

      default:
        return Filter.All;
    }
  });

  const addTodoHandler = async (title: string) => {
    setErrorMessage('');

    setTempTodo({
      id: 0,
      userId: USER_ID,
      title,
      completed: false,
    });

    try {
      const newTodo = await createTodo(title);

      setTodos((prevTodo) => [...prevTodo, newTodo]);
    } catch (error) {
      setErrorMessage('Unable to add a todo');
      throw error;
    } finally {
      setTempTodo(null);
    }
  };

  const deleteTodoHandler = async (id: number) => {
    setErrorMessage('');

    setModifyingTodoIds((prev) => [...prev, id]);

    try {
      const isTodoDelete = await deleteTodo(id);

      if (isTodoDelete) {
        setTodos((prev) => prev.filter((todo) => todo.id !== id));
      } else {
        setErrorMessage('Unable to delete a todo');
      }
    } catch (error) {
      setErrorMessage('Unable to delete a todo');
    } finally {
      setModifyingTodoIds((prev) => prev.filter((todoId) => todoId !== id));
    }
  };

  const deleteCompletedTodos = async () => {
    const allCompleted = todos.filter((todo) => todo.completed);

    await Promise.allSettled(
      allCompleted.map((todo) => deleteTodoHandler(todo.id)),
    );
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <TodoForm
          // todos={todos}
          onError={setErrorMessage}
          onTodoAdd={addTodoHandler}
        />

        {todos.length > 0 && (
          <>
            <TodoList
              todos={filteredTodos}
              deleteTodoHandler={deleteTodoHandler}
              tempTodo={tempTodo}
              modifyingTodoIds={modifyingTodoIds}
            />

            <TodoFilter
              todos={todos}
              onClearButtonDelete={deleteCompletedTodos}
              filterBy={filterBy}
              onFilterClick={setFilterBy}
            />
          </>
        )}
      </div>
      {errorMessage && (
        <ErrorMessage
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
        />
      )}
    </div>
  );
};
