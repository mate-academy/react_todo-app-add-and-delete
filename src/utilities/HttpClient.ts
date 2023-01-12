import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://mate.academy/students-api',
});

export const httpClient = {
  async get<T>(url: string) {
    const { data } = await instance.get<T>(url);

    return data;
  },

  async post<T>(url: string, postData:T) {
    const { data } = await instance.post<T>(url, postData);

    return data;
  },

  async patch<T>(url: string, updateData:T) {
    const { data } = await instance.patch<T>(url, updateData);

    return data;
  },

  async delete(url: string) {
    return instance.delete(url);
  },
};
