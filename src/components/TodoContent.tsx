import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Todo } from '../types/Todo';
import { TodoList } from './TodoList';
import {
  deleteSelectedTodo,
  getTodos,
  postTodo,
  updateTodo,
  USER_ID,
} from '../api/todos';
import { Errors } from '../types/Errors';
import classNames from 'classnames';
import { FilterBy } from '../types/FilterBy';
import { Header } from './Header';
import { Footer } from './Footer';

export const TodoContent: React.FC = () => {
  const [todoValue, setTodoValue] = useState('');
  const [todosFromServer, setTodosFromServer] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [loadingTodo, setLoadingTodo] = useState<Todo | null>(null);
  const [anyLoading, setAnyLoading] = useState<boolean>(false);
  const [filterStatus, setFilterStatus] = useState<FilterBy>(FilterBy.all);
  const [complTodoDeleteLoading, setComplTodoDeleteLoading] = useState<Todo[]>(
    [],
  );

  const completedTodos = useMemo(() => {
    return todosFromServer.filter(todo => todo.completed);
  }, [todosFromServer]);

  const isAllcompleted = useMemo(() => {
    return todosFromServer.every(todo => todo.completed);
  }, [todosFromServer]);

  const [inputDisabled, setInputDisabled] = useState<boolean>(false);

  const todoFieldRef = useRef<HTMLInputElement | null>(null);

  const active = useMemo(() => {
    return todosFromServer.filter(
      todo => !todo.completed && !todo.isOptimistic,
    );
  }, [todosFromServer]);

  function filterTodosByStatus(): Todo[] {
    const filterActions = {
      [FilterBy.active]: todosFromServer.filter(todo => !todo.completed),
      [FilterBy.completed]: completedTodos,
      [FilterBy.all]: todosFromServer,
    };

    return filterActions[filterStatus] || todosFromServer;
  }

  function resetErrorMessage(): void {
    setErrorMessage('');
  }

  function handleClearCompleted() {
    completedTodos.map(compTodo => {
      setComplTodoDeleteLoading(prev => [...prev, compTodo]);
      deleteSelectedTodo(compTodo)
        .then(() =>
          setTodosFromServer(currentTodos =>
            currentTodos.filter(
              filteringTodo => filteringTodo.id !== compTodo.id,
            ),
          ),
        )
        .catch(() => setErrorMessage(Errors.notDelete))
        .finally(() => setComplTodoDeleteLoading([]));
    });
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    setTodoValue(event.target.value);

    if (todoValue !== '') {
      resetErrorMessage();
    }
  }

  function handleDeleteTodo(todoToDelete: Todo) {
    const filteredTodoses = todosFromServer.filter(
      filtTodo => filtTodo.id !== todoToDelete.id,
    );

    setTodosFromServer(filteredTodoses);
  }

  function handleUpdateTodos(todoses: Todo[]) {
    setTodosFromServer(todoses);
  }

  function handleErrorMessage(error: Errors | '') {
    setErrorMessage(error);
  }

  function handleAllButtonClick() {
    todosFromServer.map(todo => {
      setAnyLoading(true);
      const updatedTodo: Todo = {
        ...todo,
        completed: isAllcompleted ? false : true,
      };

      updateTodo(updatedTodo)
        .then(() => getTodos())
        .then(setTodosFromServer)
        .catch(() => setErrorMessage(Errors.notUpdate))
        .finally(() => setAnyLoading(false));
    });
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (todoValue.trim() === '') {
      setErrorMessage(Errors.notEmpty);
      setTimeout(resetErrorMessage, 3000);

      return;
    }

    const optimisticTodo: Todo = {
      userId: USER_ID,
      title: todoValue.trim(),
      completed: false,
      isOptimistic: true,
    };

    const { isOptimistic, ...preparedTodo } = optimisticTodo;

    setTodosFromServer(cur => [...cur, optimisticTodo]);
    setInputDisabled(true);

    postTodo(preparedTodo)
      .then(responceTodo =>
        setTodosFromServer(currentTodos =>
          currentTodos.map(todo => (todo.isOptimistic ? responceTodo : todo)),
        ),
      )
      .then(() => {
        setTodoValue('');
        setInputDisabled(false);
      })
      .catch(() => {
        setTodosFromServer(currentTodos =>
          currentTodos.filter(todo => !todo.isOptimistic),
        );
        setErrorMessage(Errors.notAdd);
        setInputDisabled(false);
        setTimeout(resetErrorMessage, 3000);
      })
      .finally(() => {
        setLoadingTodo(null);
      });
  }

  function setLoadingValue(todo: Todo | null) {
    setLoadingTodo(todo);
  }

  useEffect(() => {
    getTodos()
      .then(data => {
        setErrorMessage('');
        setTodosFromServer(data);
      })
      .catch(() => {
        setErrorMessage(Errors.notLoad);
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      });
  }, []);

  useEffect(() => {
    if (todoFieldRef.current) {
      todoFieldRef.current.focus();
    }
  }, [todosFromServer, errorMessage]);

  return (
    <>
      <div className="todoapp__content">
        <Header
          todosFromServer={todosFromServer}
          isAllcompleted={isAllcompleted}
          handleAllButtonClick={handleAllButtonClick}
          handleSubmit={handleSubmit}
          todoFieldRef={todoFieldRef}
          inputDisabled={inputDisabled}
          todoValue={todoValue}
          handleInputChange={handleInputChange}
        />

        <TodoList
          isAllcompleted={isAllcompleted}
          todos={filterTodosByStatus()}
          completedTodos={completedTodos}
          loadingTodo={loadingTodo}
          anyLoading={anyLoading}
          clearCompleteLoading={complTodoDeleteLoading}
          setTodos={handleUpdateTodos}
          deleteTodo={handleDeleteTodo}
          setErrorMessage={handleErrorMessage}
          resetError={resetErrorMessage}
          setLoadingTodo={setLoadingValue}
        />

        {todosFromServer.length !== 0 && (
          <Footer
            handleFilterStatus={status => setFilterStatus(status)}
            active={active}
            filterStatus={filterStatus}
            completedTodos={completedTodos}
            handleClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          {
            hidden: errorMessage === '',
          },
        )}
      >
        <button data-cy="HideErrorButton" type="button" className="delete" />
        {errorMessage}
      </div>
    </>
  );
};
