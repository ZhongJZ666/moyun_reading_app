import axios from 'axios';
import { getAuthHeader } from './utils';

const API_URL = 'http://localhost:3000/api/user-books';

export default {
  async addBook(bookId) {
    const res = await axios.post(API_URL, { book_id: bookId }, { headers: getAuthHeader() });
    return res.data;
  },
  async getBooks() {
    const res = await axios.get(API_URL, { headers: getAuthHeader() });
    return res.data;
  },
  async removeBook(bookId) {
    const res = await axios.delete(`${API_URL}/${bookId}`, { headers: getAuthHeader() });
    return res.data;
  }
}; 