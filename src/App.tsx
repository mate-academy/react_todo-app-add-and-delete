import React, { useEffect, useState } from 'react';
import * as todosService from './api/todos';
import { Todo } from './types/Todo';
import { NewTodoForm } from './components/FormTodo';
import { TodoList } from './components/TodoList';
import classNames from 'classnames';
import {
  getCompletedTodosLength,
  getfilteredTodos,
} from './utils/getFilterTodos';
import { FILTERS } from './types/Filters';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<null | Partial<Todo>>(null);
  const [filter, setFilter] = useState(FILTERS.all);
  const [errorMessage, setErrorMessage] = useState('');
  const [deletedTodo, setDeletedTodo] = useState<Todo[]>([]);

  const [isLoading, setIsLoading] = useState(false);

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

  function addTodos({ userId, completed, title }: Omit<Todo, 'id'>) {
    setIsLoading(true);

    return todosService
      .createTodos({ userId, completed, title })
      .then(newTodos => {
        setTodos(currentTodos => {
          return [...currentTodos, newTodos];
        });
      })
      .finally(() => setIsLoading(false));
  }

  function deleteTodo(todoId: number) {
    setIsLoading(true);

    const todoToDelete = todos.find(todo => todo.id === todoId);

    if (todoToDelete) {
      setDeletedTodo(prevTodos => [...prevTodos, todoToDelete]);
    }

    return todosService
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
        setIsLoading(false);
        setDeletedTodo([]);
      });
  }

  function deleteCompletedTodos() {
    setIsLoading(true);
    const completedTodos = todos.filter(todo => todo.completed);

    setDeletedTodo(completedTodos);

    completedTodos.forEach(todo => {
      return todosService
        .deleteTodos(todo.id)
        .then(() => {
          setTodos(currentTodos =>
            currentTodos.filter(item => item.id !== todo.id),
          );
        })
        .catch(() => {
          showErrorMessage('Unable to delete a todo');
        })
        .finally(() => {
          setIsLoading(false);
          setDeletedTodo([]);
        });
    });
  }

  const visibleTodos = getfilteredTodos(todos, filter);

  // function upDateTodo(updatedTodo: Todo) {
  //   return todosService.upDateTodos(updatedTodo).then(todo => {
  //     setTodos(currentTodos => {
  //       const newTodos = [...currentTodos];
  //       const index = newTodos.findIndex(todo => todo.id === updatedTodo.id);

  //       newTodos.splice(index, 1, todo);

  //       return newTodos;
  //     });
  //   });
  // }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className={classNames('todoapp__toggle-all', {
              active: getCompletedTodosLength(todos) === todos.length,
            })}
            data-cy="ToggleAllButton"
          />

          <NewTodoForm
            onSubmit={addTodos}
            userId={todosService.USER_ID}
            onError={showErrorMessage}
            onSubmitTempTodo={setTempTodo}
            isLoading={isLoading}
          />
        </header>
        {todos.length > 0 && (
          <TodoList
            todos={visibleTodos}
            onDelete={deleteTodo}
            tempTodo={tempTodo}
            isLoading={isLoading}
            deletedTodo={deletedTodo}
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
