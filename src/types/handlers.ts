import { FilterOption } from './types';

export type HandleErrorClear = () => void;
export type HandleNewTodoInputChange = (title: string) => void;
export type HandleFilterChange = (filter: FilterOption) => void;
export type HandleTodoAdd = (title: string) => void;
export type HandleTodoRemove = (id: number) => void;
export type HandleCompletedTodosRemove = () => void;
