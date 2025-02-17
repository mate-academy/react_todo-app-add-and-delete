import React, { useContext, useState, useEffect, useRef } from 'react';
import { Todo } from '../Todo/Todo';
import { Notification } from '../Notification/Notification';
import { TodoContext } from '../../contexts/TodoContext';
import { USER_ID, createTodo, deleteTodo, updateTodo } from '../../api/todos';
import {
  FilterContext,
  ACTIONSINFILTERCONTEXT,
} from '../../contexts/FilterContext';
import { Filter } from '../Filter/Filter';

export const TodoApp: React.FC = () => {
  const { todosFromServer, refreshTodos, putErrorWarning } =
    useContext(TodoContext)!;
  const {
    filteredTodos,
    currentFilterCriteria,
    itemsLeft,
    totalCompletedTodos,
  } = useContext(FilterContext)!;
  const [showFooterOrNot, setShowFooterOrNot] = useState(false);
  const [textInFormToCreateTodo, settextInFormToCreateTodo] = useState('');
  const refInputCreatTodo = useRef<HTMLInputElement>(null);

  const hanldeInputValueFormCreateTodo = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    settextInFormToCreateTodo(event.target.value);
  };

  useEffect(() => {
    refInputCreatTodo.current!.focus();
  });

  useEffect(() => {
    if (currentFilterCriteria !== ACTIONSINFILTERCONTEXT.ALL) {
      setShowFooterOrNot(true);

      return;
    }

    if (filteredTodos.length < 1) {
      setShowFooterOrNot(false);

      return;
    }

    setShowFooterOrNot(true);
  }, [filteredTodos, currentFilterCriteria]);

  const handleSubmitToCreateTodo = (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    refInputCreatTodo.current?.focus();
    const whitNoWhitSpace = textInFormToCreateTodo.trim();

    if (whitNoWhitSpace !== '') {
      refInputCreatTodo.current!.disabled = true;

      refreshTodos(prev => {
        prev.push({
          title: textInFormToCreateTodo,
          id: 0,
          userId: 0,
          completed: false,
          isAwaitServer: true,
        });

        return [...prev];
      });

      createTodo({ title: whitNoWhitSpace, userId: USER_ID, completed: false })
        .then(res => {
          refreshTodos(prev => {
            const newState = [...prev];

            newState[prev.length - 1] = { ...res, isAwaitServer: false };

            return newState;
          });
          settextInFormToCreateTodo('');
          refInputCreatTodo.current!.disabled = false;
        })
        .catch(() => {
          putErrorWarning('Unable to add a todo');
          refInputCreatTodo.current!.disabled = false;

          todosFromServer.splice(
            todosFromServer.findIndex(
              e => e.id === todosFromServer[todosFromServer.length - 1].id,
            ),
            1,
          );
          refreshTodos([...todosFromServer]);
          settextInFormToCreateTodo(prev => prev);
        });
    } else {
      putErrorWarning('Title should not be empty');
    }
  };

  const handleClearAllCompletedTodosClick = () => {
    refreshTodos(prev => {
      for (const elm of prev) {
        if (elm.completed) {
          elm.isAwaitServer = true;
        }
      }

      return [...prev];
    });

    const todosToDelete = todosFromServer.reduce((acc, e) => {
      if (e.completed) {
        acc.push(e.id);
      }

      return acc;
    }, [] as number[]);

    const promises = todosToDelete.map(e => deleteTodo(e));
    let realyDel: number[] = [];

    Promise.allSettled(promises)
      .then(res => {
        let counter = 0;

        if (res.some(e => e.status === 'rejected')) {
          putErrorWarning('Unable to delete a todo');
        }

        realyDel = res.reduce((acc, e) => {
          if (e.status === 'fulfilled') {
            acc.push(todosToDelete[counter]);
          }

          counter++;

          return acc;
        }, [] as number[]);
      })
      .finally(() => {
        realyDel.forEach(e => {
          todosFromServer.splice(
            todosFromServer.findIndex(el => e === el.id),
            1,
          );
        });

        refreshTodos([...todosFromServer]);
      });
  };

  const handleToggleAllTodos = () => {
    const completOrNot = itemsLeft === 0 ? false : true;

    const todosToUpdate: number[] = [];

    for (const elem of todosFromServer) {
      if (elem.completed === !completOrNot) {
        elem.isAwaitServer = true;
        todosToUpdate.push(elem.id);
      }
    }

    refreshTodos([...todosFromServer]);

    const promises = todosToUpdate.map(e =>
      updateTodo(e, { completed: completOrNot }),
    );
    let todosToRefresh: number[] = [];

    Promise.allSettled(promises)
      .then(res => {
        if (res.some(e => e.status === 'rejected')) {
          putErrorWarning('Unable to update a todo');
        }

        todosToRefresh = res.reduce((acc, e, idx) => {
          if (e.status === 'fulfilled') {
            acc.push(todosToUpdate[idx]);
          }

          return acc;
        }, [] as number[]);
      })
      .finally(() => {
        todosToRefresh.forEach(e => {
          todosFromServer[
            todosFromServer.findIndex(el => e === el.id)
          ].completed = completOrNot;
        });

        for (const elm of todosFromServer) {
          elm.isAwaitServer = false;
        }

        refreshTodos([...todosFromServer]);
      });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          {showFooterOrNot && (
            <button
              type="button"
              className={`todoapp__toggle-all ${itemsLeft || 'active'}`}
              data-cy="ToggleAllButton"
              onClick={handleToggleAllTodos}
            />
          )}

          {/* Add a todo on form submit */}
          <form onSubmit={handleSubmitToCreateTodo}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              ref={refInputCreatTodo}
              onChange={hanldeInputValueFormCreateTodo}
              value={textInFormToCreateTodo}
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          <Todo
            todos={filteredTodos}
            refreshTodos={refreshTodos}
            setErrorMsg={putErrorWarning}
          />
        </section>

        {/* Hide the footer if there are no todos */}
        {showFooterOrNot && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {`${itemsLeft} items left`}
            </span>

            {/* Active link should have the 'selected' class */}
            <Filter />

            {/* this button should be disabled if there are no completed todos */}
            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={!Boolean(totalCompletedTodos)}
              onClick={handleClearAllCompletedTodosClick}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <Notification />
    </div>
  );
};
