/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';

import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { Todo } from './types/Todo';
import { client } from './utils/fetchClient';
import { TodoStatus } from './types/TodoStatus';
import { Header } from './components/Header';

const USER_ID = 11468;

function filterBySelect(
  todo: Todo,
  selectedOption: string,
) : boolean {
  switch (selectedOption) {
    case TodoStatus.Active:
      return !todo.completed;
    case TodoStatus.Completed:
      return todo.completed;
    default:
      return true;
  }
}

function filterTodos(todos: Todo[], selectedOption: string) {
  if (!selectedOption) {
    return todos;
  }

  return todos.filter((todo) => (
    filterBySelect(todo, selectedOption)
  ));
}

export const App: React.FC = () => {
  const [loadingTodos, setLoadingTodos] = useState(false);
  const [loadingTodosIds, setLoadingTodosIds] = useState<number[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedOption, setSelectedOption] = useState(TodoStatus.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [isInputFieldDisabled, setIsInputFieldDisabled] = useState(false);

  function showError(message: string) {
    setErrorMessage(message);

    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  }

  const handleCompletedChange = (todoId: number) => {
    const foundTodo = todos.find(todo => todo.id === todoId);

    if (foundTodo) {
      foundTodo.completed = !foundTodo.completed;
    }

    setTodos([...todos]);
  };

  useEffect(() => {
    setLoadingTodos(true);

    client.get<Todo[]>(`/todos?userId=${USER_ID}`)
      .then((todosFromSrever) => {
        setTodos(todosFromSrever);
        setLoadingTodos(false);
      })
      .catch(() => {
        showError('Unable to load todos');
        setLoadingTodos(false);
      });
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const visibleTodos = filterTodos(todos, selectedOption);
  const handleChangeSelect = (newOption: TodoStatus) => {
    setSelectedOption(newOption);
  };

  const handleDeleteTodo = (todoId: number) => {
    setLoadingTodosIds([todoId]);

    client.delete(`/todos/${todoId}`)
      .then(() => {
        setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
        setLoadingTodosIds([]);
      })
      .catch(() => {
        showError('Unable to delete a todo');
        setLoadingTodosIds([]);
      })
      .finally(() => setLoadingTodosIds([todoId]));
  };

  const handleDeleteAll = () => {
    const filteredTodos = todos.filter((current) => current.completed);

    setLoadingTodosIds(filteredTodos.map((current) => current.id));
    Promise.allSettled(filteredTodos
      .map(todo => client.delete(`/todos/${todo.id}`)))
      .then((rezult) => {
        // rezult: {status: 'fulfilled'|'rejected'}[];
        const fulfilledTodoIds: number[] = [];
        let wasFailed = false;

        rezult.forEach((response, i) => {
          if (response.status === 'fulfilled') {
            fulfilledTodoIds.push(filteredTodos[i].id);
          } else {
            wasFailed = true;
          }
        });

        if (wasFailed) {
          showError('Unable to delete a todo');
        }

        setLoadingTodosIds([]);
        setTodos(currentTodos => currentTodos
          .filter(current => !fulfilledTodoIds.includes(current.id)));
      });
  };

  const handleAddTodo = (newTitle: string) => {
    const todoIds = todos.map(({ id }) => id);
    const maxTodoId = Math.max(...todoIds);

    if (!newTitle?.trim()?.length) {
      showError('Title should not be empty');
    } else {
      setInputValue(newTitle);
      const newTodo = {
        id: maxTodoId + 1,
        userId: USER_ID,
        title: newTitle.trim(),
        completed: false,
      };

      setIsInputFieldDisabled(true);
      client.post<Todo>('/todos', newTodo)
        .then((createdTodo) => {
          setLoadingTodosIds([]);
          setTempTodo(null);
          setTodos([...todos.filter((current) => current.id !== 0), createdTodo]);
          setInputValue('');
          setIsInputFieldDisabled(false);
        })
        .catch(() => {
          setIsInputFieldDisabled(false);
          setLoadingTodosIds([]);
          setTodos([...todos
            .filter((current) => current.id !== 0)]);
          showError('Unable to add a todo');
        });

      if (tempTodo === null) {
        const fakeTodo = { ...newTodo, id: 0 };

        setTempTodo(fakeTodo);
        setLoadingTodosIds([fakeTodo.id]);
        setTodos([...todos, fakeTodo]);
      }
    }
  };

  return (
    <section className="section container">
      <p className="title is-4">
        <div className="todoapp">
          <h1 className="todoapp__title">todos</h1>

          <div className="todoapp__content">

            <Header
              todos={visibleTodos}
              onInputChange={handleAddTodo}
              inputValue={inputValue}
              setInputValue={setInputValue}
              isInputFieldDisabled={isInputFieldDisabled}
            />

            {!loadingTodos && (
              <TodoList
                todos={visibleTodos}
                onCompletedChange={handleCompletedChange}
                onDeleteTodo={handleDeleteTodo}
                loadingTodosIds={loadingTodosIds}
              />
            )}

            {todos.length !== 0 && (
              <Footer
                onChangeSelect={handleChangeSelect}
                selectedOption={selectedOption}
                todos={todos}
                onHandleDeleteAll={handleDeleteAll}
              />
            )}
          </div>

          <div
            data-cy="ErrorNotification"
            className={classNames(
              'notification is-danger is-light has-text-weight-normal',
              { hidden: !errorMessage },
            )}

          >
            <button
              data-cy="HideErrorButton"
              type="button"
              onClick={() => (setErrorMessage(''))}
              className="delete"
            />
            {errorMessage}

            {/* Unable to update a todo */}
          </div>
        </div>
      </p>
    </section>
  );
};
