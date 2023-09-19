/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState, useMemo } from 'react';
import {
  TransitionGroup,
  CSSTransition,
} from 'react-transition-group';
import { UserWarning } from './UserWarning';
import { TodoItem } from './components/TodoItem/TodoItem';
import {
  deleteTodoById,
  deleteTodos,
  getTodos,
  setNewTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import { Notification } from './components/Notification/Notification';
import { StatusEnum } from './types/StatusEnum';
import { TodosFilter } from './components/TodosFilter/TodosFilter';

const USER_ID = 11497;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoadingAddTodo, setIsLoadingAddTodo] = useState(false);
  const [todosIdToDelete, setTodosIdToDelete] = useState<number[]>([]);
  const [filter, setFilter] = useState<StatusEnum>(
    window.location.hash.slice(2) as StatusEnum || StatusEnum.All,
  );

  const handleChangeFilter = (newFilter: StatusEnum) => {
    setFilter(newFilter);
  };

  const handleChangeNewTodoTitle
    = (event: React.ChangeEvent<HTMLInputElement>) => {
      setNewTodoTitle(event.target.value);
    };

  const handelSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!newTodoTitle.trim()) {
      setErrorMessage('Title can\'t be empty');

      return;
    }

    setErrorMessage('');
    setIsLoadingAddTodo(true);

    setTempTodo({
      completed: false,
      id: 0,
      title: newTodoTitle,
      userId: USER_ID,
    });

    setNewTodo({
      userId: USER_ID,
      title: newTodoTitle,
      completed: false,
    })
      .then(response => {
        setNewTodoTitle('');

        return response;
      })
      .catch(error => {
        setErrorMessage('Unable to add a todo');

        throw error;
      })
      .then((newTodo) => {
        setTodos((prevState) => [...prevState, newTodo]);
      })
      .finally(() => {
        setIsLoadingAddTodo(false);
        setTempTodo(null);
      });
  };

  useEffect(() => {
    setErrorMessage('');

    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to show todos');
      });
  }, []);

  const handelDeleteTodoById = (todoId: number) => {
    setTodosIdToDelete(prevState => [...prevState, todoId]);

    deleteTodoById(todoId)
      .catch(error => {
        setErrorMessage('Unable to delete a todo');

        throw error;
      })
      .then(() => {
        setTodos(prevState => prevState.filter(todo => todo.id !== todoId));
      })
      .finally(() => {
        setTodosIdToDelete(prevState => prevState.filter(id => id !== todoId));
      });
  };

  const handelDeleteCompletedTodos = () => {
    deleteTodos(
      todos
        .filter(({ completed }) => completed)
        .map(({ id }) => id),
    )
      .catch(error => {
        setErrorMessage('Unable to delete todos');

        throw error;
      })
      .then(() => {
        setTodos(prevState => prevState.filter(({ completed }) => !completed));
      });
  };

  const hasCompletedTodo = useMemo(() => {
    return todos.some(todo => todo.completed);
  }, [todos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {!!todos.length && (
            <button type="button" className="todoapp__toggle-all active" />
          )}

          {/* Add a todo on form submit */}
          <form onSubmit={handelSubmit}>
            <input
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={newTodoTitle}
              onChange={handleChangeNewTodoTitle}
              disabled={isLoadingAddTodo}
            />
          </form>
        </header>

        <section className="todoapp__main">
          <TransitionGroup>
            {todos.filter(todo => {
              switch (filter) {
                case StatusEnum.Active:
                  return !todo.completed;
                case StatusEnum.Completed:
                  return todo.completed;
                case StatusEnum.All:
                default:
                  return todo;
              }
            }).map(todo => (
              <CSSTransition
                key={todo.id}
                timeout={300}
                classNames="item"
              >
                <TodoItem
                  todo={todo}
                  todosIdToDelete={todosIdToDelete}
                  onDeleteTodo={handelDeleteTodoById}
                />
              </CSSTransition>
            ))}
            {tempTodo && (
              <CSSTransition
                key={0}
                timeout={300}
                classNames="item"
              >
                <TodoItem
                  todo={tempTodo}
                  todosIdToDelete={todosIdToDelete}
                  onDeleteTodo={handelDeleteTodoById}
                />
              </CSSTransition>
            )}
          </TransitionGroup>
        </section>

        {!!todos.length && (
          <footer className="todoapp__footer">
            <span className="todo-count">
              3 items left
            </span>

            <TodosFilter filter={filter} onChangeFilter={handleChangeFilter} />
            <button
              type="button"
              className="todoapp__clear-completed"
              disabled={!hasCompletedTodo}
              onClick={() => handelDeleteCompletedTodos()}
            >
              Clear completed
            </button>

          </footer>
        )}
      </div>

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      {
        errorMessage && (
          <Notification
            errorMessage={errorMessage}
            onCloseErrorMessage={setErrorMessage}
          />
        )
      }
    </div>
  );
};
