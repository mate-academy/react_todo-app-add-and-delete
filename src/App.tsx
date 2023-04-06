/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';

import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import { Error } from './types/Error';
import { TodoCondition } from './types/TodoCondition';

import { filterTodos } from './utils/filterTodos';
import { USER_ID, deleteTodo, getTodos } from './api/todos';

import { UserWarning } from './UserWarning';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { TodoItem } from './components/TodoItem';
import { Footer } from './components/Footer/Footer';
import { ErrorMessage } from './components/ErrorMessage';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[] | null>(null);
  const [filterType, setFilterType] = useState<Filter>(Filter.All);
  const [errorType, setErrorType] = useState(Error.None);
  const [containsCompleted, setContainsCompleted] = useState(false);
  const [containsActive, setContainsActive] = useState(false);
  const [todoCondition, setTodoCondition]
    = useState<TodoCondition>(TodoCondition.neutral);
  const [procesingTodosId, setProcesingTodosId] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const handleError = (err: Error) => {
    if (err !== Error.None) {
      setTimeout(() => setErrorType(Error.None), 3000);
    }

    setErrorType(err);
  };

  const todoDelete = (todoId: number) => {
    setTodoCondition(TodoCondition.deleting);
    setProcesingTodosId([todoId]);
    deleteTodo(todoId)
      .catch(() => handleError(Error.Delete))
      .finally(() => setTodoCondition(TodoCondition.neutral));
  };

  const clearCompleted = () => {
    setTodoCondition(TodoCondition.deleting);
    setContainsCompleted(false);

    todos?.forEach(todo => {
      if (todo.completed) {
        setProcesingTodosId((state) => [...state, todo.id]);
        deleteTodo(todo.id)
          .catch(() => handleError(Error.Delete))
          .finally(() => setTodoCondition(TodoCondition.neutral));
      }
    });
  };

  useEffect(() => {
    getTodos(USER_ID)
      .then(result => {
        setTodos(result);
        setContainsCompleted(result.some(todo => todo.completed === true));
        setContainsActive(result.some(todo => todo.completed === false));
      })
      .catch(() => handleError(Error.Load));
  }, [todos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const filteredTodos = todos ? filterTodos(todos, filterType) : null;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">

        <Header
          containsActive={containsActive}
          handleError={handleError}
          setTodoCondition={setTodoCondition}
          onTrickTempTodo={setTempTodo}
        />

        {filteredTodos && (
          <>
            <section className="todoapp__main">
              <TodoList
                todos={filteredTodos}
                onDeleteTodo={todoDelete}
                todoCondition={todoCondition}
                procesingTodosId={procesingTodosId}
              />

              {tempTodo && (
                <TodoItem
                  todo={tempTodo}
                  todoCondition={todoCondition}
                  onDeleteTodo={todoDelete}
                />
              )}
            </section>
          </>
        )}

        {!!todos?.length && (
          <Footer
            onFilter={setFilterType}
            filterType={filterType}
            containsCompleted={containsCompleted}
            onClearCompleted={clearCompleted}
          />
        )}
      </div>

      {
        errorType !== Error.None && (
          <ErrorMessage errorType={errorType} handleError={setErrorType} />
        )
      }
    </div>
  );
};
