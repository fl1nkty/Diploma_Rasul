// src/components/SQLEditor.jsx

import React from 'react';
import { useDispatch } from 'react-redux';
import { setQuery } from '../actions/query';
import { Button, TextField, Typography } from '@mui/material';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import TerminalIcon from '@mui/icons-material/Terminal';

function SQLEditor() {
  const dispatch = useDispatch();
  const [queryText, setQueryText] = React.useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Отправляем в Redux: { type: 'SET_QUERY', payload: queryText }
    dispatch(setQuery(queryText));
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
        <TerminalIcon />
        <Typography variant="h6">Compiler</Typography>
      </div>
      <div style={{ display: 'flex', gap: '12px' }}>
        <TextField
          name="query"
          fullWidth
          multiline
          rows={3}
          onChange={(e) => setQueryText(e.target.value)}
          value={queryText}
          placeholder="Например: SELECT * FROM users WHERE age > 30;"
          variant="outlined"
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Button
            type="submit"
            startIcon={<PlayCircleIcon />}
            variant="contained"
            color="primary"
          >
            RUN
          </Button>
          <Button
            type="button"
            variant="outlined"
            color="secondary"
            onClick={() => setQueryText('')}
          >
            RESET
          </Button>
        </div>
      </div>
    </form>
  );
}

export default SQLEditor;
