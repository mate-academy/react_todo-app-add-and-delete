/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect, useMemo } from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { Select } from './types/Select';
import { getTodos, postDelete } from './api/todos';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { Notification } from './components/Notification';
import { Errors } from './types/Errors';
import { Header } from './components/Header';

export const USER_ID = 9960;

export const App: React.FC = () => {
  const [todoList, setTodoList] = useState<Todo[] | null>(null);
  const [selectedFilter, setSelectedFilter] = useState(Select.ALL);
  const [typeError, setTypeError] = useState<Errors | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);

  const filteredList = useMemo(() => {
    return todoList && todoList.filter((todo) => {
      switch (selectedFilter) {
        case Select.ACTIVE:
          return !todo.completed;
        case Select.COMPLETED:
          return todo.completed;
        default:
          return true;
      }
    });
  }, [selectedFilter, todoList]);

  const countItemLeft = todoList?.filter(todo => !todo.completed).length;

  const deleteClickHandlerItem = (
    id: number,
    loaderState: (loaderTodo: boolean) => void,
  ) => {
    loaderState(true);

    if (id) {
      postDelete(id)
        .then(() => {
          const newArray = todoList ? [...todoList] : [];
          const objFindIndex = newArray.findIndex(obj => obj.id === id);

          newArray.splice(objFindIndex, 1);
          setTodoList(newArray);
          loaderState(false);
        })
        .catch(() => {
          setTypeError(Errors.REMOVE);
        });
    }
  };

  const deleteClickHandlerFooter = () => {
    const completedTodo
    = todoList?.filter(todo => todo.completed).map(todo => todo.id);

    if (completedTodo) {
      setLoadingTodoIds(completedTodo);
    }

    completedTodo?.forEach(todo => {
      postDelete(todo)
        .then(() => {
          if (todoList) {
            setTodoList(
              todoList.filter(todoFilter => {
                return !completedTodo.includes(todoFilter.id);
              }),
            );
          }
        })
        .catch(() => {
          setTypeError(Errors.REMOVE);
        });
    });
  };

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodoList)
      .catch(() => {
        setTypeError(Errors.UPDATE);
      });
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          USER_ID={USER_ID}
          counterItemLeft={countItemLeft}
          setTypeError={setTypeError}
          todoList={todoList}
          setTempTodo={setTempTodo}
          setTodoList={setTodoList}
        />

        {todoList && (
          <TodoList
            filteringList={filteredList}
            tempTodo={tempTodo}
            loadingTodoIds={loadingTodoIds}
            deleteClickHandler={deleteClickHandlerItem}
          />
        )}

        {(todoList?.length !== 0 && todoList) && (
          <Footer
            countItemLeft={countItemLeft}
            selectedFilter={selectedFilter}
            setSelectedFilter={setSelectedFilter}
            todoList={todoList}
            deleteClickHandlerFooter={deleteClickHandlerFooter}
          />
        )}

      </div>

      <Notification
        setTypeError={setTypeError}
        typeError={typeError}
      />
    </div>
  );
};
