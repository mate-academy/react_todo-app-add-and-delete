/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { client } from './utils/fetchClient';
import { USER_ID, getTodos } from './api/todos';
import { Todo } from './types/Todo';
import { UserWarning } from './UserWarning';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { TodoStatus } from './types/TodoStatus';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filtrationParam, setFiltrationParam] = useState(TodoStatus.all);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processedTodosIds, setProcessedTodosIds] = useState<number[]>([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setErrorMessage('');
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
      });
  }, []);

  useEffect(() => {
    if (errorMessage != '') {
      setTimeout(() => setErrorMessage(''), 3000);
    }
  }, [errorMessage]);

  const filterTodos = (todosFromServer: Todo[], param: TodoStatus) => {
    return todosFromServer.filter(todo => {
      if (param === TodoStatus.active) {
        return !todo.completed;
      }

      if (param === TodoStatus.completed) {
        return todo.completed;
      }

      return true;
    });
  };

  const deleteTodo = (id: number) => {
    setProcessedTodosIds(ids => [...ids, id]);
    client
      .delete(`/todos/${id}`)
      .then(() => {
        setTodos(currentTodos => currentTodos.filter(todo => todo.id != id));
      })
      .catch(() => setErrorMessage('Unable to delete a todo'))
      .finally(() => {
        setProcessedTodosIds(ids => ids.splice(ids.indexOf(id), 1));
      });
  };

  const deleteAllCompletedTodos = () => {
    filterTodos(todos, TodoStatus.completed)
      .map(({ id }) => id)
      .map(deleteTodo);
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          titleValue={newTodoTitle}
          setTitle={setNewTodoTitle}
          setTodos={setTodos}
          setTempTodo={setTempTodo}
          setErrorMessage={setErrorMessage}
        />
        {!!todos.length && (
          <TodoList
            todos={filterTodos(todos, filtrationParam)}
            tempTodo={tempTodo}
            processedTodosIds={processedTodosIds}
            deleteTodo={deleteTodo}
          />
        )}
        {!!todos.length && (
          <Footer
            activeTodosCount={filterTodos(todos, TodoStatus.active).length}
            completedTodosCount={
              filterTodos(todos, TodoStatus.completed).length
            }
            selectedParam={filtrationParam}
            onSelectParam={setFiltrationParam}
            deleteAllCompletedTodos={deleteAllCompletedTodos}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: errorMessage === '' },
        )}
      >
        <button data-cy="HideErrorButton" type="button" className="delete" />
        {errorMessage}
      </div>
    </div>
  );
};
