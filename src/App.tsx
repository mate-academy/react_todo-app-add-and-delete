import React, { useEffect, useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Etodos, ResponseError } from './types/enum';
import { UserData } from './types/userData';
import { Todo } from './types/Todo';
import { deleteTodoOnServer, getTodos, updateTodoProp } from './api';
import { TodoItem } from './components/Todo';
import { TodoHeader } from './components/TodoHeader';
import { Footer } from './components/Footer';
import { Notification } from './components/Notification';

const defaultUser = {
  createdAt: '2023-07-10T13:09:53.578Z',
  email: 'gookidoo@gmail.com',
  id: 11038,
  name: 'Віктор Булденко',
  phone: null,
  updatedAt: '2023-07-10T13:09:53.578Z',
  username: null,
  website: null,
};

export const App: React.FC = () => {
  const [user] = useState<UserData>(defaultUser);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isUncomplete, setIsUncomplete] = useState<number>(0);
  const [isShowFooter, setIsShowFooter] = useState<boolean>(true);
  const [sortTodosBy, setSortTodosBy] = useState<Etodos>(Etodos.ALL);
  const [respError, setRespError] = useState<ResponseError>(ResponseError.NOT);
  const [isToggleActiveTodos, setIsToggleActiveTodos] = useState(true);
  const [isTodoInputDisabled, setIsTodoInputDisabled] = useState(false);
  const [creatingTodoTitle, setCreatingTodoTitle] = useState('');

  const toggleTodosActive = () => {
    const promiseList = todos.map((todo) => {
      if (todo.completed !== isToggleActiveTodos) {
        return updateTodoProp(todo.id, {
          completed: isToggleActiveTodos,
        });
      }

      return [];
    });

    setIsToggleActiveTodos(!isToggleActiveTodos);

    Promise.all(promiseList).then(() => {
      getTodos(user.id).then((todoList) => {
        setTodos(todoList);
        setIsShowFooter(Boolean(todoList.length));
      });
    });
  };

  const checkCompletedTodo = (arr: Todo[]) => {
    let counter = 0;

    for (let i = 0; i < arr.length; i += 1) {
      if (!arr[i].completed) {
        counter += 1;
      }
    }

    setIsUncomplete(counter);
  };

  const deleteTodo = (id: number) => {
    setIsTodoInputDisabled(true);

    return deleteTodoOnServer(id)
      .then(() => {
        getTodos(user.id).then((todoList) => {
          setTodos(todoList);
          checkCompletedTodo(todoList);
          setIsShowFooter(Boolean(todoList.length));
          setIsTodoInputDisabled(false);
        });
      })
      .catch(() => setRespError(ResponseError.ADD));
  };

  const updateTodo = (todoId: number, obj: Partial<Todo>) => {
    setIsTodoInputDisabled(true);
    updateTodoProp(todoId, obj)
      .then(() => {
        getTodos(user.id).then((todoList) => {
          setTodos(todoList);
          checkCompletedTodo(todoList);
          setIsShowFooter(Boolean(todoList.length));
          setIsTodoInputDisabled(false);
        });
      })
      .catch(() => setRespError(ResponseError.UPDATE));
  };

  const displayTodos = (sortBy: Etodos) => {
    switch (sortBy) {
      case Etodos.ACTIVE:
        return todos.filter((todo) => todo.completed === false);

      case Etodos.COMPLETED:
        return todos.filter((todo) => todo.completed === true);

      default:
        return [...todos];
    }
  };

  useEffect(() => {
    setIsTodoInputDisabled(true);
    getTodos(user.id)
      .then((todosList) => {
        setIsUncomplete(
          todosList.reduce((acc: number, todo: Todo):number => {
            if (!todo.completed) {
              return acc + 1;
            }

            return acc;
          }, 0),
        );

        setTodos(todosList);
        setIsTodoInputDisabled(false);
      });
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          todos={todos}
          toggleTodosActive={toggleTodosActive}
          userID={user.id}
          setRespError={setRespError}
          setTodos={setTodos}
          checkCompletedTodo={checkCompletedTodo}
          setIsShowFooter={setIsShowFooter}
          isDisable={isTodoInputDisabled}
          setIsDisable={setIsTodoInputDisabled}
          setCreatingTodoTitle={setCreatingTodoTitle}
        />

        <section className="todoapp__main">
          <TransitionGroup>
            {displayTodos(sortTodosBy).map((todoObj) => (
              <CSSTransition
                key={todoObj.id}
                timeout={500}
                classNames="item"
              >
                <TodoItem
                  todo={todoObj}
                  key={todoObj.id}
                  deleteTodo={deleteTodo}
                  updateTodo={updateTodo}
                />
              </CSSTransition>
            ))}
            {creatingTodoTitle && (
              <CSSTransition
                key={0}
                timeout={300}
                classNames="temp-item"
              >
                <TodoItem
                  todo={{
                    id: 0,
                    userId: user.id,
                    title: creatingTodoTitle,
                    completed: false,
                  }}
                  deleteTodo={deleteTodo}
                  updateTodo={updateTodo}
                />
              </CSSTransition>
            )}
          </TransitionGroup>

        </section>

        {isShowFooter && (
          <Footer
            isUncomplete={isUncomplete}
            sortTodosBy={sortTodosBy}
            setSortTodosBy={setSortTodosBy}
            todos={todos}
            setTodos={setTodos}
            checkCompletedTodo={checkCompletedTodo}
            setIsShowFooter={setIsShowFooter}
            userID={user.id}
          />
        )}
      </div>

      {respError !== ResponseError.NOT && (
        <Notification respError={respError} setRespError={setRespError} />
      )}
    </div>
  );
};
