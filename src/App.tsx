/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { FormEvent, useEffect, useState } from 'react';
import { Todo } from './Components/Todo';
import { Todo as TodoType } from './types/Todo';
import { getTodos, addTodo, removeTodo } from './api/todos';
import { Notification } from './Components/Notification';
import { Filter } from './Components/Filter';

const USER_ID = 10539;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<TodoType[]>([]);
  const [error, setError] = useState('');
  const [filteredTodos, setFilteredTodos] = useState<TodoType[]>([]);
  const [filter, setFilter] = useState('');
  const [addValue, setAddValue] = useState('');
  const [isInputDisable, setIsInputDisable] = useState(false);
  const [tempTodo, setTempTodo] = useState<TodoType | null>(null);
  const [deleteIds, setDeleteIds] = useState<number[]>([]);

  useEffect(() => {
    getTodos(USER_ID)
      .then(response => {
        setTodos(response);
      })
      .catch(() => setError('Unable to Load todos'));
  }, [deleteIds]);

  useEffect(() => {
    getTodos(USER_ID)
      .then(response => {
        setFilteredTodos(response);
      })
      .catch(() => setError('Unable to Load todos'));
  }, [todos, tempTodo]);

  useEffect(() => {
    setTimeout(() => {
      setError('');
    }, 3000);
  }, [error]);

  useEffect(() => {
    switch (filter) {
      case 'Active': {
        setFilteredTodos(todos.filter(todo => todo.completed === false));
        break;
      }

      case 'Completed': {
        setFilteredTodos(todos.filter(todo => todo.completed === true));
        break;
      }

      default: {
        setFilteredTodos(todos);
      }
    }
  }, [filter]);

  const handleFilter = (value: string) => {
    setFilter(value);
  };

  const handleClose = () => {
    setError('');
  };

  const handleAddTodo = (event: FormEvent) => {
    event.preventDefault();

    if (!addValue) {
      setError('Title cant be empty');
    } else {
      const newTodo: TodoType = {
        id: 0,
        userId: USER_ID,
        title: addValue,
        completed: false,
      };

      setTempTodo(newTodo);
      setIsInputDisable(true);

      addTodo(USER_ID, newTodo).then(() => {
        setAddValue('');
        setIsInputDisable(false);
        setTempTodo(null);
      }).catch(() => setError('Unable to add a todo'));
    }
  };

  const handleRemoveTodo = (id: number) => {
    removeTodo(id).then(() => {
      setTodos(todos.filter((todo) => todo.id !== id));
    }).catch(() => setError('Unable to delete a todo'));
  };

  const todoElements = filteredTodos.map(todo => (
    <Todo
      todo={todo}
      temp={!!deleteIds.includes(todo.id)}
      handleRemoveTodo={handleRemoveTodo}
      key={todo.id}
    />
  ));
  const countNotCompletedtodos = todos.filter(todo => (
    todo.completed === false
  )).length;

  const completedTodos = todos.filter(todo => (
    todo.completed === true
  ));

  const handleRemoveCompletedTodos = () => {
    completedTodos.forEach(completedTodo => {
      removeTodo(completedTodo.id).then(() => {
        setTodos(todos.filter((todo) => todo.id !== completedTodo.id));
        setDeleteIds(prevState => ([
          ...prevState,
          completedTodo.id,
        ]));
      }).catch(() => setError('Unable to delete a todo'));
    });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this buttons is active only if there are some active todos */}
          <button type="button" className="todoapp__toggle-all active" />

          {/* Add a todo on form submit */}
          <form onSubmit={handleAddTodo}>
            <input
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={addValue}
              onChange={(event) => setAddValue(event.target.value)}
              disabled={isInputDisable && true}
            />
          </form>
        </header>

        <section className="todoapp__main">
          {todoElements}
          {tempTodo && <Todo todo={tempTodo} temp />}
        </section>

        {todos.length > 0
          && (
            <Filter
              countNotCompletedtodos={countNotCompletedtodos}
              handleFilter={handleFilter}
              filter={filter}
              handleRemoveCompletedTodos={handleRemoveCompletedTodos}
            />
          )}
      </div>

      <Notification message={error} handleClose={handleClose} />
    </div>
  );
};
