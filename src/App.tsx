/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Todo } from './components/Todo';
import { Error } from './components/Error';
import { Todo as TodoType } from './types/Todo';
import { addTodo, deleteTodo, getTodos } from './api/todos';
import { Filter } from './types/Filter';

export const USER_ID = 10583;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<TodoType[]>([]);
  const [tempTodos, setTempTodos] = useState<TodoType | null>(null);
  const [error, setError] = useState<string>('');
  const [isInputLocked, setIsInputLocked] = useState(false);
  const [filter, setFilter] = useState<Filter>(Filter.all);

  useEffect(() => {
    getTodos(USER_ID)
      .then((data) => setTodos(data))
      .catch(() => setError('Unable to fetch data'));
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setError('');
    }, 3000);
  }, [error]);

  useEffect(() => {
    if(tempTodos){
    addTodo({
      title: tempTodos.title,
      completed: tempTodos.completed,
      userId: USER_ID,
    })
      .then((res) => {
        if (res) {
          const newTodo = { ...tempTodos };

          setTempTodos(null);
          newTodo.id = res.id;
          setTodos((prev) => [...prev, newTodo]);
        }
      })
      .catch(() => setError('Unable to add a todo'))
      .finally(() => setIsInputLocked(false));
    }
  }, [tempTodos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const deleteTask = (id: number): void => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const removeAllCompleted = () => {
    todos
      .filter((todo) => todo.completed)
      .forEach((todo) => deleteTodo(todo.id)
        .then(() => setTodos((prev) => prev
          .filter((todoNew) => !todoNew.completed)))
        .catch(() => setError('Unable to delete a todo')));
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        {todos.length > 0 && (
          <Header
            setTempTodos={setTempTodos}
            setError={setError}
            isInputLocked={isInputLocked}
            setIsInputLocked={setIsInputLocked}
          />
        )}

        <section className="todoapp__main">
          {todos
            ?.filter((todo: TodoType) => {
              switch (filter) {
                case Filter.active:
                  return !todo.completed;
                case Filter.completed:
                  return todo.completed;
                default:
                  return true;
              }
            })
            .map((todo) => (
              <Todo
                deleteTask={deleteTask}
                key={todo.id}
                todo={todo}
                setError={setError}
                temp={false}
              />
            ))}

          {tempTodos && 
            <Todo
              deleteTask={deleteTask}
              key={tempTodos.id}
              todo={tempTodos}
              setError={setError}
              temp
            />
          }
        </section>

        {todos?.length && (
          <Footer
            setFilter={setFilter}
            filter={filter}
            todos={todos}
            removeAllCompleted={removeAllCompleted}
          />
        )}
      </div>

      {error && <Error error={error} />}
    </div>
  );
};
