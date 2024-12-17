import { FilterTypes } from "../constants/FilterTypes";

export type FilterType = typeof FilterTypes[keyof typeof FilterTypes];
