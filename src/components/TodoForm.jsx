// src/components/TodoForm.jsx
import React, { useState, useEffect } from 'react';
import {
  Modal, Box, TextField, Button, DialogActions, DialogContent,
  FormControlLabel, Switch, IconButton, InputAdornment, Typography
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AddAPhoto, PictureAsPdf } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

function TodoForm({ open, onClose, onSubmit, initialData = null }) {
  const [text, setText] = useState('');
  const [dueDate, setDueDate] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [image, setImage] = useState(null);
  const [pdf, setPdf] = useState(null);

  useEffect(() => {
    if (open && initialData) {
      setText(initialData.text || '');
      setDueDate(initialData.dueDate ? new Date(initialData.dueDate) : null);
      setCompleted(initialData.completed || false);
    } else if (open && !initialData) {
      setText(''); setDueDate(null); setCompleted(false); setImage(null); setPdf(null);
    }
  }, [open, initialData]);

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(',')[1]); // Remove data:image/...;base64,
      reader.onerror = error => reject(error);
    });
  };

  const handleSubmit = async () => {
    if (!text.trim()) {
      alert('Please enter TODO text');
      return;
    }

    const payload = {
      text: text.trim(),
      dueDate: dueDate ? dueDate.toISOString() : null,
      completed,
    };

    if (image) {
      try {
        payload.imageBase64 = await fileToBase64(image);
        payload.imageName = image.name;
      } catch (err) {
        alert('Image upload failed');
        return;
      }
    }

    if (pdf) {
      try {
        payload.pdfBase64 = await fileToBase64(pdf);
        payload.pdfName = pdf.name;
      } catch (err) {
        alert('PDF upload failed');
        return;
      }
    }

    onSubmit(payload);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <IconButton onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
          <CloseIcon />
        </IconButton>
        <DialogContent>
          <TextField
            fullWidth
            label="TODO Text *"
            value={text}
            onChange={(e) => setText(e.target.value)}
            sx={{ mb: 2 }}
            required
          />
          <DateTimePicker
            label="Due Date"
            value={dueDate}
            onChange={setDueDate}
            slotProps={{ textField: { fullWidth: true, sx: { mb: 2 } } }}
          />
          <FormControlLabel
            control={<Switch checked={completed} onChange={(e) => setCompleted(e.target.checked)} />}
            label="Completed"
            sx={{ mb: 2 }}
          />
          <TextField
            type="file"
            fullWidth
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0] || null)}
            InputProps={{ startAdornment: <InputAdornment position="start"><AddAPhoto /></InputAdornment> }}
            sx={{ mb: 2 }}
          />
          {initialData?.imageUrl && (
            <Typography variant="body2" sx={{ mb: 1 }}>
              Current Image: <a href={initialData.imageUrl} target="_blank" rel="noopener noreferrer">View</a>
            </Typography>
          )}
          <TextField
            type="file"
            fullWidth
            accept=".pdf"
            onChange={(e) => setPdf(e.target.files[0] || null)}
            InputProps={{ startAdornment: <InputAdornment position="start"><PictureAsPdf /></InputAdornment> }}
            sx={{ mb: 2 }}
          />
          {initialData?.pdfUrl && (
            <Typography variant="body2" sx={{ mb: 2 }}>
              Current PDF: <a href={initialData.pdfUrl} target="_blank" rel="noopener noreferrer">View</a>
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={!text.trim()}>
            {initialData ? 'Update' : 'Add'} TODO
          </Button>
        </DialogActions>
      </Box>
    </Modal>
  );
}

export default TodoForm;