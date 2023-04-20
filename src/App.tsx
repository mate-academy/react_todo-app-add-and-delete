import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { createTodos, getTodos, removeTodo } from './api/todos';
import { TodosList } from './components/TodoList/TodoList';
import { TodoHeader } from './components/TodoHeader/TodoHeader';
import { TodoFooter } from './components/TodoFooter/TodoFooter';
import { TodoError } from './components/TodoError/TodoError';
import { TodoStatus } from './types/TodoStatus';

const statusTodos = (todos: Todo[], filterBy: TodoStatus) => {
  let filteredTodos = todos;

  switch (filterBy) {
    case TodoStatus.Active:
      filteredTodos = todos.filter(item => !item.completed);
      break;
    case TodoStatus.Completed:
      filteredTodos = todos.filter(item => item.completed);
      break;
    case TodoStatus.All:
    default:
      break;
  }

  return filteredTodos;
};

const USER_ID = 6709;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isActive, setIsActive] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [activeFilter, setActiveFilter] = useState<TodoStatus>(TodoStatus.All);
  const [error, setError] = useState('');
  const [deleteTodoId, setDeleteTodoId] = useState(0);
  const notCompletedTodo = todos.filter(todo => !todo.completed).length;
  const completedTodo = todos.filter(todo => todo.completed).length;

  useEffect(() => {
    getTodos(USER_ID)
      .then((res) => {
        setTodos(res);
      })
      .catch(() => {
        setError('Unable to add a todo');

        const timer = setTimeout(() => {
          setError('');
        }, 3000);

        return () => {
          clearTimeout(timer);
        };
      });
  }, []);

  const addTodo = (title: string) => {
    if (!title.trim()) {
      setError('Title can`t be empty');
      setTimeout(() => {
        setError('');
      }, 3000);
    } else {
      const newTodo = {
        id: 0,
        userId: USER_ID,
        title,
        completed: false,
      };

      setTempTodo(newTodo);
      setIsDisabled(true);
      setError('');

      createTodos(USER_ID, newTodo)
        .then((res) => {
          setTodos((prevTodo) => {
            return [...prevTodo, res];
          });
        })
        .catch(() => {
          setError('Unable to add a todo');

          const timer = setTimeout(() => {
            setError('');
          }, 3000);

          return () => {
            clearTimeout(timer);
          };
        })
        .finally(() => {
          setIsDisabled(false);
          setTempTodo(null);
        });
    }
  };

  const deleteTodo = (id: number) => {
    setDeleteTodoId(id);

    removeTodo(id)
      .then(() => {
        const result = todos.filter(todo => todo.id !== id);

        setTodos(result);
        setError('');
      })
      .catch(() => {
        setError('Unable to delete a todo');

        const timer = setTimeout(() => {
          setError('');
        }, 3000);

        return () => {
          clearTimeout(timer);
        };
      })
      .finally(() => {
        setDeleteTodoId(null || 0);
      });
  };

  const handleChangeCompleted = (id: number) => {
    const completed = todos.map(item => (
      item.id === id
        ? {
          ...item,
          completed: !item.completed,
        }
        : item
    ));

    setTodos(completed);
  };

  const handleClearCompleted = () => {
    const filteredTodos = todos.filter(item => !item.completed);

    todos.forEach(item => {
      if (item.completed) {
        removeTodo(item.id);
      }
    });

    setTodos(filteredTodos);
  };

  const handleToggleAll = () => {
    setIsActive(!isActive);
  };

  useEffect(() => {
    const result = todos.map(item => {
      return { ...item, completed: isActive };
    });

    setTodos(result);
  }, [isActive]);

  const filteredTodos = statusTodos(todos, activeFilter);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          handleToggleAll={handleToggleAll}
          todos={todos}
          addTodo={addTodo}
          isDisabled={isDisabled}
          notCompletedTodo={notCompletedTodo}
        />

        <section className="todoapp__main">
          <TodosList
            todos={filteredTodos}
            handleChangeCompleted={handleChangeCompleted}
            deleteTodo={deleteTodo}
            tempTodo={tempTodo}
            deleteTodoId={deleteTodoId}
          />
        </section>
        {todos.length !== 0 && (
          <footer className="todoapp__footer">
            <TodoFooter
              handleFilter={setActiveFilter}
              activeFilter={activeFilter}
              notCompletedTodo={notCompletedTodo}
              completedTodo={completedTodo}
              handleClearCompleted={handleClearCompleted}
            />
          </footer>
        )}
      </div>

      {error && (<TodoError error={error} setError={setError} />) }
    </div>
  );
};
