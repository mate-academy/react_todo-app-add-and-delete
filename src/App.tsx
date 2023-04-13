import React, { useEffect, useMemo, useState } from "react";
import { UserWarning } from "./UserWarning";
import { getTodos, postTodo, deleteTodo } from "./api/todos";
import { Todo } from "./types/Todo";
import { ListofTodo } from "./Components/ListofTodo/ListofTodo";
import { Error } from "./Components/Error/Error";
import { FilterTodo } from "./Components/FilterTodo/FilterTodo";
import { FilterStatus } from "./types/FilterStatus";

const USER_ID = 6429;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [temporaryTodo, setTemporaryTodo] = useState<Todo>();
  const [filter, setFilter] = useState<FilterStatus>(FilterStatus.all);
  const activeTodos = useMemo(() => {
    return todos.filter(({ completed }) => !completed).length;
  }, [todos]);
  const completedTodos = useMemo(() => {
    return todos.filter(({ completed }) => completed);
  }, [todos]);

  useEffect(() => {
    getTodos(USER_ID)
      .then((result: React.SetStateAction<Todo[]>) => setTodos(result))
      .catch(() => setError("Unable to load the todos"));
  }, []);

  const currentTodos = useMemo(() => {
    return todos.filter((todo) => {
      switch (filter) {
        case FilterStatus.active:
          return !todo.completed;

        case FilterStatus.completed:
          return todo.completed;

        default:
          return todo;
      }
    });
  }, [todos, filter]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const addTodo = (todoTitle: string) => {
    const newTodo = {
      title: todoTitle,
      userId: USER_ID,
      completed: false,
    };

    setTemporaryTodo({ ...newTodo, id: 0 });

    postTodo(USER_ID, newTodo)
      .then((result) => {
        setTodos((state) => [...state, result]);
      })
      .catch(() => {
        setError("Unable to add a todo");
        setTimeout(() => {
          setError("");
        }, 3000);
      })
      .finally(() => {
        setTemporaryTodo(undefined);
      });
  };

  const removeTodo = (id: number) => {
    return deleteTodo(id)
      .then(() => {
        setTodos(todos.filter((todo) => todo.id !== id));
      })
      .catch(() => {
        setError("Cant to delete a todo");
        setTimeout(() => {
          setError("");
        }, 3000);
      });
  };

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!title || title.trim() === "") {
      setError("Tittle can not be empty");
      setTimeout(() => {
        setError("");
      }, 3000);

      return;
    }

    addTodo(title);
    setTitle("");
  };

  const changeHandler = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setTitle(e.target.value);
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button type="button" className="todoapp__toggle-all active">
            {" "}
          </button>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={title}
              onChange={changeHandler}
            />
          </form>
        </header>

        {todos.length > 0 && (
          <>
            <section className="todoapp__main">
              <ListofTodo
                todos={currentTodos}
                onDeleteTodo={removeTodo}
                temporaryTodo={temporaryTodo}
              />
            </section>

            <footer className="todoapp__footer">
              <span className="todo-count">{`${activeTodos} items left`}</span>

              <FilterTodo filter={filter} onFilterChange={setFilter} />

              {!completedTodos && (
                <button type="button" className="todoapp__clear-completed">
                  Clear completed
                </button>
              )}
            </footer>
          </>
        )}
      </div>

      {error !== " " && <Error error={error} onClear={() => setError(" ")} />}
    </div>
  );
};
