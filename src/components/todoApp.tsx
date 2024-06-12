/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext, useEffect, useRef, useState } from "react";
import cn from "classnames";
import { Todos } from "./todos";

import * as todoService from "../api/todos";
import { TodoFooter } from "./todoFooter";
import { TodosContext } from "../services/Store";
import { ErrorText } from "../enums/errorText";

const USER_ID = 116;

export const TodoApp: React.FC = () => {
  const {
    todos,
    setTodos,
    isSubmiting,
    setIsSubmiting,
    loadErrorMessage,
    setLoadErrorMessage,
    isHidden,
    setIsHidden,
    allTodosButton,
    setAllTodosButton,
    setTempTodo,
  } = useContext(TodosContext);

  const [title, setTitle] = useState("");

  useEffect(() => {
    const loadTodos = async () => {
      try {
        const todosFromServer = await todoService.getTodos(USER_ID);

        setTodos(todosFromServer);
      } catch (error) {
        setLoadErrorMessage(ErrorText.Loading);
        setIsHidden(false);
      }
    };

    loadTodos();
  }, [setIsHidden, setLoadErrorMessage, setTodos]);

  useEffect(() => {
    setIsHidden(true);
    setLoadErrorMessage("");

    if (loadErrorMessage) {
      setLoadErrorMessage(loadErrorMessage);
      setIsHidden(false);
    }

    const timeout = setTimeout(() => {
      setLoadErrorMessage("");
    }, 3000);

    return () => clearTimeout(timeout);
  }, [isHidden, loadErrorMessage, setIsHidden, setLoadErrorMessage]);

  function handleSubmit(inputTitle: string): Promise<void> {
    const createdTodo = {
      userId: USER_ID,
      title: inputTitle,
      completed: false,
    };

    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: inputTitle,
      completed: false,
    });

    setIsSubmiting(true);

    return todoService
      .addTodo(createdTodo)
      .then((newTodo) => {
        const newTodos = [...todos].concat(newTodo);

        setTitle("");
        setTodos(newTodos);

        return;
      })
      .catch((error) => {
        setLoadErrorMessage(ErrorText.Adding);
        throw error;
      })
      .finally(() => {
        setIsSubmiting(false);
        setTempTodo(null);
      });
  }

  const allTodosActive = todos.every((todo) => todo.completed);
  const todosWithNotCompleted = todos.some((todo) => !todo.completed);

  const handleAllTodosButton = () => {
    setAllTodosButton(!allTodosButton);

    let copiedTodos = [...todos];

    if (allTodosActive) {
      copiedTodos = [...todos].map((todo) => {
        const todoItem = todo;

        todoItem.completed = false;

        return todoItem;
      });
    } else if (todosWithNotCompleted) {
      copiedTodos = [...todos].map((todo) => {
        const todoItem = todo;

        todoItem.completed = true;

        return todoItem;
      });
    }

    setTodos(copiedTodos);
  };

  const inputOnEnterHandler = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter") {
      setLoadErrorMessage("");
      event.preventDefault();
      if (!!title.trim().length) {
        const trimmedTitile = title.trim();

        handleSubmit(trimmedTitile);
      } else if (!title.trim().length) {
        setLoadErrorMessage(ErrorText.Title);

        return;
      }
    }
  };

  const inputField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputField.current) {
      inputField.current.focus();
    }
  });

  return (
    <div className={cn("todoapp", { "has-error": isHidden === false })}>
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              className={cn("todoapp__toggle-all", {
                active: allTodosActive,
              })}
              data-cy="ToggleAllButton"
              onClick={handleAllTodosButton}
            />
          )}

          <form method="POST" action="api/todos">
            <input
              ref={inputField}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={title}
              disabled={isSubmiting}
              onChange={(event) => setTitle(event.target.value)}
              onKeyDown={inputOnEnterHandler}
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          <>
            <Todos />
            {!!todos.length && <TodoFooter />}
          </>
        </section>
      </div>

      <div
        data-cy="ErrorNotification"
        className={cn(
          "notification is-danger is-light has-text-weight-normal",
          { hidden: isHidden },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setIsHidden(true)}
        />
        {loadErrorMessage}
      </div>
    </div>
  );
};
