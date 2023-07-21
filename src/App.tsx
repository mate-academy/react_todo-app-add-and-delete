import React, { useEffect, useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Etodos, ResponseError } from './types/enum';
import { UserData } from './types/userData';
import { Todo } from './types/Todo';
import {
  createTodo,
  deleteTodoOnServer,
  getTodos,
  updateTodoProp,
} from './api';
import { TodoItem } from './components/Todo';
import { TodoHeader } from './components/TodoHeader';
import { Footer } from './components/Footer';
import { Notification } from './components/Notification';

const user: UserData = {
  createdAt: '2023-07-10T13:09:53.578Z',
  email: 'gookidoo@gmail.com',
  id: 11038,
  name: 'Віктор Булденко',
  phone: null,
  updatedAt: '2023-07-10T13:09:53.578Z',
  username: null,
  website: null,
};

let isUncomplete = 0;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isShowFooter, setIsShowFooter] = useState<boolean>(true);
  const [sortTodosBy, setSortTodosBy] = useState<Etodos>(Etodos.ALL);
  const [error, setError] = useState<ResponseError>(ResponseError.NOT);
  const [isToggleActiveTodos, setIsToggleActiveTodos] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
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
      }).catch(err => new Error(err.message))
        .finally(() => setIsLoading(false));
    });
  };

  const checkCompletedTodo = (arr: Todo[]) => {
    isUncomplete = 0;
    for (let i = 0; i < arr.length; i += 1) {
      if (!arr[i].completed) {
        isUncomplete += 1;
      }
    }
  };

  const deleteTodo = (id: number) => {
    setIsLoading(true);

    return deleteTodoOnServer(id)
      .then(() => {
        getTodos(user.id).then((todoList) => {
          setTodos(todoList);
          checkCompletedTodo(todoList);
          setIsShowFooter(Boolean(todoList.length));
        });
      })
      .catch(() => setError(ResponseError.ADD))
      .finally(() => setIsLoading(false));
  };

  const deleteCompletedTodo = () => {
    getTodos(user.id, 'completed=true')
      .then((todoList) => {
        return Promise.all(
          todoList.map((todo: Todo) => deleteTodoOnServer(todo.id)),
        );
      })
      .then(() => getTodos(user.id))
      .then((todoList) => {
        setTodos(todoList);
        checkCompletedTodo(todoList);
        setIsShowFooter(Boolean(todoList.length));
      })
      .catch((errorresp) => new Error(errorresp.message))
      .finally(() => setIsLoading(false));
  };

  const updateTodo = (todoId: number, obj: Partial<Todo>) => {
    setIsLoading(true);
    updateTodoProp(todoId, obj)
      .then(() => {
        getTodos(user.id).then((todoList) => {
          setTodos(todoList);
          checkCompletedTodo(todoList);
          setIsShowFooter(Boolean(todoList.length));
        });
      })
      .catch(() => setError(ResponseError.UPDATE))
      .finally(() => setIsLoading(false));
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

  const headerAddTodo = (str: string) => {
    createTodo(str.trim(), user.id)
      .then(() => {
        getTodos(user.id).then((todoList) => {
          setTodos(todoList);
          checkCompletedTodo(todoList);
          setIsShowFooter(Boolean(todoList.length));
          setCreatingTodoTitle('');
        });
      })
      .catch(() => setError(ResponseError.ADD))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    setIsLoading(true);
    getTodos(user.id).then((todosList) => {
      checkCompletedTodo(todosList);
      setTodos(todosList);
    }).catch(err => new Error(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          todos={todos}
          toggleTodosActive={toggleTodosActive}
          setError={setError}
          setIsShowFooter={setIsShowFooter}
          isDisable={isLoading}
          setIsLoading={setIsLoading}
          setCreatingTodoTitle={setCreatingTodoTitle}
          headerAddTodo={headerAddTodo}
        />

        <section className="todoapp__main">
          <TransitionGroup>
            {displayTodos(sortTodosBy).map((todoObj) => (
              <CSSTransition key={todoObj.id} timeout={500} classNames="item">
                <TodoItem
                  todo={todoObj}
                  key={todoObj.id}
                  deleteTodo={deleteTodo}
                  updateTodo={updateTodo}
                />
              </CSSTransition>
            ))}
            {creatingTodoTitle && (
              <CSSTransition key={0} timeout={300} classNames="temp-item">
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
            deleteCompletedTodo={deleteCompletedTodo}
          />
        )}
      </div>

      {error !== ResponseError.NOT && (
        <Notification error={error} setError={setError} />
      )}
    </div>
  );
};
