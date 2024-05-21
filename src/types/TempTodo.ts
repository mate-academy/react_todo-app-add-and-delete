import {Todo} from "./Todo";

export interface ITempTodo {
    isLoading: boolean;
    todo: Omit<Todo, 'userId'> | null;
}
