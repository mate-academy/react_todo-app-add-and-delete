import React, { useEffect, useState } from 'react';
import * as todosService from './api/todos';
import { Todo } from './types/Todo';
import { NewTodoForm } from './components/FormTodo';
import { TodoList } from './components/TodoList';
import classNames from 'classnames';
import { getfilteredTodos } from './utils/getFilterTodos';
import { FILTERS } from './types/Filters';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<null | Todo>(null);
  const [filter, setFilter] = useState(FILTERS.all);
  const [errorMessage, setErrorMessage] = useState('');
  const [processingIds, setProcessingIds] = useState<number[]>([]);

  function showErrorMessage(error: string) {
    setErrorMessage(error);
    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  }

  useEffect(() => {
    if (todosService.USER_ID) {
      todosService
        .getTodos()
        .then(setTodos)
        .catch(() => showErrorMessage('Unable to load todos'));
    }
  }, []);

  const completedTodos = todos.filter(todo => todo.completed);

  function addTodos({ userId, completed, title }: Omit<Todo, 'id'>) {
    return todosService
      .createTodos({ userId, completed, title })
      .then(newTodos => {
        setTodos(currentTodos => {
          return [...currentTodos, newTodos];
        });
      });
  }

  function deleteTodo(todoId: number) {
    setProcessingIds(prevIds => [...prevIds, todoId]);

    todosService
      .deleteTodos(todoId)
      .then(() =>
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        ),
      )
      .catch(() => {
        showErrorMessage('Unable to delete a todo');
      })
      .finally(() => {
        setProcessingIds(prevIds => prevIds.filter(id => id !== todoId));
      });
  }

  function deleteCompletedTodos() {
    completedTodos.forEach(todo => {
      deleteTodo(todo.id);
    });
  }

  const visibleTodos = getfilteredTodos(todos, filter);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className={classNames('todoapp__toggle-all', {
              active: completedTodos.length === todos.length,
            })}
            data-cy="ToggleAllButton"
          />

          <NewTodoForm
            onSubmit={addTodos}
            userId={todosService.USER_ID}
            onError={showErrorMessage}
            onSubmitTempTodo={setTempTodo}
            processingIds={processingIds}
            tempTodo={tempTodo}
          />
        </header>
        {todos.length > 0 && (
          <TodoList
            todos={visibleTodos}
            onDelete={deleteTodo}
            tempTodo={tempTodo}
            processingIds={processingIds}
          />
        )}

        {todos.length > 0 && (
          <Footer
            filter={filter}
            onFilter={setFilter}
            todos={todos}
            onDeleteAllComleted={deleteCompletedTodos}
          />
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        onError={setErrorMessage}
      />
    </div>
  );
};
