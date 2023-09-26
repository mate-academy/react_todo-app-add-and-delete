/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';

import { Todo } from './types/Todo';
import * as todoService from './api/todos';
import { ForComletedTodo } from './types/enumFilter';
import { TodoItem } from './Components/TodoItem';
import { Footer } from './Components/Footer';
import { Header } from './Components/Header';
import { ErrorNotification } from './Components/ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [condition, setCondition] = useState(ForComletedTodo.All);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [inputDisabled, setInputDisabled] = useState(false);
  const [processingTodoIds, setProcessingTodoIds] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const hasTodos = todos.length > 0;

  const isAllCopleted = todos.every(todo => todo.completed);

  const fetchData = async () => {
    try {
      setErrorMessage(null);
      const todosFetch = await todoService.getTodos();

      setTodos(todosFetch);
    } catch (err) {
      setErrorMessage('Unable to load todos');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const hadleAddTodo = (title: string) => {
    setInputDisabled(true);

    setTempTodo({
      id: 0,
      userId: 0,
      title: title.trim(),
      completed: false,
    });

    return todoService
      .addTodo(title)
      .then((newTodo) => {
        setTodos((prevTodos) => [...prevTodos, newTodo]);
      })
      .catch((error) => {
        setErrorMessage('Unable to add a todo');
        throw error;
      })
      .finally(() => {
        setInputDisabled(false);
        setTempTodo(null);
      });
  };

  const handleDeleteTodo = (todoId: number) => {
    setInputDisabled(true);
    setProcessingTodoIds((prevTodoIds) => [...prevTodoIds, todoId]);

    todoService
      .deleteTodo(todoId)
      .then((() => {
        setTodos((prevTodos) => prevTodos.filter(todo => todo.id !== todoId));
      }))
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
      })
      .finally(() => {
        setInputDisabled(false);
        setProcessingTodoIds(
          (prevTodoIds) => prevTodoIds.filter(id => id !== todoId),
        );
      });
  };

  const handleRenameTodo = (todo: Todo, newTodoTitle: string) => {
    setProcessingTodoIds((prevTodoIds) => [...prevTodoIds, todo.id]);

    todoService.updateTodo({
      id: todo.id,
      title: newTodoTitle,
      userId: todo.userId,
      completed: todo.completed,
    })
      .then(updatedTodo => {
        setTodos(prevState => prevState.map(currentTodo => (
          currentTodo.id !== updatedTodo.id
            ? currentTodo
            : updatedTodo
        )));
      })
      .catch(() => {
        setErrorMessage('Unable to ubdate a todo');
      })
      .finally(() => {
        setProcessingTodoIds(
          (prevTodoIds) => prevTodoIds.filter(id => id !== todo.id),
        );
      });
  };

  const filteredTodos = useMemo(() => todos.filter(({ completed }) => {
    switch (condition) {
      case ForComletedTodo.Active:
        return !completed;
      case ForComletedTodo.Completed:
        return completed;
      default:
        return 1;
    }
  }), [condition, todos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          onTodoAddError={setErrorMessage}
          isAllCopleted={isAllCopleted}
          hasTodos={hasTodos}
          onTodoAdd={hadleAddTodo}
          inputDisabled={inputDisabled}
        />

        <section className="todoapp__main" data-cy="TodoList">
          {filteredTodos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onTodoDelete={() => handleDeleteTodo(todo.id)}
              onRenameTodo={(todoTitle) => handleRenameTodo(todo, todoTitle)}
              isProcessing={processingTodoIds.includes(todo.id)}
            />
          ))}
        </section>

        {tempTodo && (
          <TodoItem
            todo={tempTodo}
            isProcessing
          />
        )}

        {/* Hide the footer if there are no todos */}
        {hasTodos && (
          <Footer
            todos={todos}
            condition={condition}
            setCondition={setCondition}
          />
        )}
      </div>

      <ErrorNotification
        setErrorMessage={setErrorMessage}
        errorMessage={errorMessage}
      />
    </div>
  );
};
