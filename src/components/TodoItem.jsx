import React from 'react'
import {
  ListItem, ListItemText, IconButton, Box, Chip, Link, Typography
} from '@mui/material'
import { Edit, Delete, PictureAsPdf, Image } from '@mui/icons-material'

function TodoItem({ todo, onEdit, onDelete }) {
  return (
    <ListItem
      secondaryAction={
        <Box>
          <IconButton onClick={onEdit}><Edit /></IconButton>
          <IconButton onClick={onDelete}><Delete /></IconButton>
        </Box>
      }
      sx={{
        border: '1px solid #ddd',
        borderRadius: 2,
        mb: 2,
        bgcolor: 'background.paper'
      }}
    >
      <ListItemText
        primary={
          <Typography variant="h6" component="div">
            {todo.completed ? <del>{todo.text}</del> : todo.text}
          </Typography>
        }
        secondary={
          <Box>
            {todo.dueDate && (
              <Chip
                label={`Due: ${new Date(todo.dueDate).toLocaleString()}`}
                size="small"
                color="primary"
                sx={{ mr: 1 }}
              />
            )}
            {todo.imageUrl && (
              <Link href={todo.imageUrl} target="_blank" sx={{ mr: 1 }}>
                <Image fontSize="small" /> Image
              </Link>
            )}
            {todo.pdfUrl && (
              <Link href={todo.pdfUrl} target="_blank">
                <PictureAsPdf fontSize="small" /> PDF
              </Link>
            )}
          </Box>
        }
      />
    </ListItem>
  )
}

export default TodoItem