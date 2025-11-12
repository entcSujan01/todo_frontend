import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Box, CircularProgress } from '@mui/material';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import client from './api/client';

function App() {
  const [todos, setTodos] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const res = await client.get('/todos');
      setTodos(res.data);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleAdd = async (formData) => {
    await client.post('/todos', formData);
    fetchTodos();
    setOpen(false);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h3" align="center" gutterBottom>
        My To-Do App
      </Typography>
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Button variant="contained" size="large" onClick={() => setOpen(true)}>
          Add New TODO
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TodoList todos={todos} refreshTodos={fetchTodos} />
      )}

      <TodoForm open={open} onClose={() => setOpen(false)} onSubmit={handleAdd} />
    </Container>
  );
}

export default App;