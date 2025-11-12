import React, { useState, useEffect } from 'react'
import {
  Container, Typography, Button, List, Box, CircularProgress, Alert
} from '@mui/material'
import TodoItem from './components/TodoItem.jsx'
import TodoForm from './components/TodoForm.jsx'
import client from './api/client.js'

function App() {
  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [openForm, setOpenForm] = useState(false)
  const [editTodo, setEditTodo] = useState(null)

  const fetchTodos = async () => {
    try {
      setLoading(true)
      const res = await client.get('/todos')
      setTodos(res.data)
      setError('')
    } catch (err) {
      setError('Failed to load todos. Check backend.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTodos()
  }, [])

  const handleSubmit = async (formData) => {
    try {
      if (editTodo) {
        const res = await client.put(`/todos/${editTodo._id}`, formData)
        setTodos(todos.map(t => t._id === editTodo._id ? res.data : t))
      } else {
        const res = await client.post('/todos', formData)
        setTodos([res.data, ...todos])
      }
      setEditTodo(null)
    } catch (err) {
      alert('Submit failed')
      console.error(err)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this todo?')) return
    try {
      await client.delete(`/todos/${id}`)
      setTodos(todos.filter(t => t._id !== id))
    } catch (err) {
      alert('Delete failed')
    }
  }

  const handleEdit = (todo) => {
    setEditTodo(todo)
    setOpenForm(true)
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center">
        My To-Do App
      </Typography>

      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Button
          variant="contained"
          size="large"
          onClick={() => { setEditTodo(null); setOpenForm(true) }}
        >
          ADD NEW TODO
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <List>
          {todos.map((todo) => (
            <TodoItem
              key={todo._id}
              todo={todo}
              onEdit={() => handleEdit(todo)}
              onDelete={() => handleDelete(todo._id)}
            />
          ))}
        </List>
      )}

      <TodoForm
        open={openForm}
        onClose={() => { setOpenForm(false); setEditTodo(null) }}
        onSubmit={handleSubmit}
        initialData={editTodo}
      />
    </Container>
  )
}

export default App