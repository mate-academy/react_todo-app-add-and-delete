/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';

import { Todo } from './types/Todo';
import * as todoService from './api/todos';
import { ErrorMessage } from './components/ErrorMessage/ErrorMessage';
import { TodoFooter } from './components/TodoFooter';
import { wait } from './servises/delay';
import * as filterServises from './servises/TodoFooter';
import { TodoList } from './components/TodoList';
import { Header } from './components/Header';
import { ButtonName } from './enums/ButtonsEnum';

const LOADING_TIMER = 500;
const ERROR_TIMER = 3000;

export const App: React.FC = () => {
  const [todoTitle, setTodoTitle] = useState('');
  const [loadContent, setLoadedContent] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [titleInputState, setTitleInputState] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [activeFooter, setActiveFooter] = useState(false);
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [activeTodo, setActiveTodo] = useState<Todo[]>([]);

  useEffect(() => {
    todoService
      .getTodos()
      .then(response => {
        if (response.length > 0) {
          setActiveFooter(true);
          setLoadedContent(response);
        }
      })
      .catch(error => {
        setErrorMessage('Unable to load todos');
        setTimeout(() => {
          setErrorMessage('');
        }, ERROR_TIMER);
        throw error;
      });
  }, []);

  const handleTodoTitle = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    event.preventDefault();
    const newTitle = event.target.value;

    setTodoTitle(newTitle);
  };

  const handleFilter = async (filterBy: ButtonName) => {
    const initTodos = await todoService.getTodos();
    const filteredTodos = filterServises.filter(initTodos, filterBy);

    setLoadedContent(filteredTodos);
  };

  const handleAddTodo = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmiting) {
      return;
    }

    setIsSubmiting(true);
    setTitleInputState(true);

    const newTodoTitle = todoTitle.trim();

    if (!newTodoTitle) {
      setTitleInputState(false);
      setErrorMessage('Title should not be empty');
      await wait(3000);
      setErrorMessage('');
      setIsSubmiting(false);

      return;
    }

    try {
      const temp: Todo = {
        title: newTodoTitle,
        userId: todoService.USER_ID,
        completed: false,
        id: 0,
      };

      setTempTodo(temp);
      const createdTodo: Todo = await todoService.postTodos(temp);

      setLoadedContent(prev => [...prev, createdTodo]);
      setActiveFooter(true);
      setTodoTitle('');
    } catch (error) {
      setErrorMessage('Unable to add a todo');
      await wait(3000);
      setErrorMessage('');
    } finally {
      setTempTodo(null);
      setTitleInputState(false);
      setIsSubmiting(false);
    }
  };

  const handleDeleteTodo = async (dataId: Todo['id']) => {
    try {
      const deletedData = loadContent.find(todo => todo.id === dataId);

      if (!deletedData) {
        setErrorMessage('Todo not found');
        await wait(3000);
        setErrorMessage('');

        return;
      }

      await todoService.deleteTodos(dataId);
      await wait(LOADING_TIMER);
      const newTodoList = loadContent.filter(todo => todo.id !== dataId);

      if (newTodoList.length === 0) {
        setActiveFooter(false);
      }

      setLoadedContent(newTodoList);
    } catch (error) {
      setErrorMessage('Unable to delete a todo');
      await wait(ERROR_TIMER);
      setErrorMessage('');
    } finally {
      setTempTodo(null);

      if (loadContent.length === 0) {
        setActiveFooter(false);
      }
    }
  };

  const handleActiveRemoving = async (todoId: Todo['id']) => {
    const active = loadContent.filter(todo => todo.id === todoId);

    if (active) {
      setActiveTodo(active);
    }

    await handleDeleteTodo(todoId);
  };

  const handleDeleteFinished = async () => {
    try {
      const finishedTodos = loadContent.filter(todo => todo.completed);

      setActiveTodo(finishedTodos);
      await wait(LOADING_TIMER);

      const failForDelete = [];
      const deleted: Todo[] = [];

      const result = await Promise.allSettled(
        finishedTodos.map(todo => todoService.deleteTodos(todo.id)),
      );

      result.forEach((resultItem, index) => {
        if (resultItem.status === 'rejected') {
          failForDelete.push(finishedTodos[index]);
        } else if (resultItem.status === 'fulfilled') {
          deleted.push(finishedTodos[index]);
        }
      });

      if (failForDelete.length > 0) {
        setErrorMessage('Unable to delete a todo');
      }

      await wait(ERROR_TIMER);
      setErrorMessage('');

      const deletedId: number[] = deleted.map(deletedItem => deletedItem.id);

      const newTodoList: Todo[] = loadContent.filter(
        todo => !deletedId.includes(todo.id),
      );

      if (newTodoList.length === 0) {
        setActiveFooter(false);
      }

      setLoadedContent(newTodoList);
    } catch (error) {
      setErrorMessage('Unable to delete a todo');
      await wait(ERROR_TIMER);
      setErrorMessage('');
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          titleChange={handleTodoTitle}
          todoTitle={todoTitle}
          titleState={titleInputState}
          todoList={loadContent}
          add={handleAddTodo}
          isSubmiting={isSubmiting}
        />

        <TodoList
          todos={loadContent}
          tempTodo={tempTodo}
          handleActiveTodo={handleActiveRemoving}
          deleteTodo={handleDeleteTodo}
          activeTodo={activeTodo}
        />

        {activeFooter && (
          <TodoFooter
            todoList={loadContent}
            getFilteredList={handleFilter}
            clearCompleted={handleDeleteFinished}
          />
        )}
      </div>

      <ErrorMessage errorMessage={errorMessage} />
    </div>
  );
};
