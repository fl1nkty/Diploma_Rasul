// src/components/SQLQueries.jsx

import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography, IconButton, Divider } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import toast, { Toaster } from 'react-hot-toast';

const SQLQueries = () => {
  const queries = [
    // SELECT-примеры
    "SELECT * FROM people WHERE country = 'United States';",
    "SELECT first_name, last_name, age FROM people WHERE age > 30 ORDER BY age DESC;",
    "SELECT country, COUNT(*) AS count_per_country FROM people GROUP BY country;",
    "SELECT country, AVG(age) AS avg_age FROM people GROUP BY country HAVING AVG(age) > 40;",
    "SELECT * FROM people WHERE first_name LIKE 'A%' OR last_name LIKE 'S%';",
    "SELECT * FROM people WHERE age BETWEEN 20 AND 40;",

    // INSERT INTO-примеры
    "INSERT INTO people (id, first_name, last_name, age, country)\nVALUES (201, 'Ivan', 'Petrov', 30, 'Russia');",

  ];

  const copyToClipboard = (sql) => {
    navigator.clipboard.writeText(sql);
    toast.success('Query copied to clipboard', { position: 'bottom-center' });
  };

  return (
    <div>
      <Toaster position="top-center" reverseOrder={false} />
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>SQL Queries</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {queries.map((query, idx) => (
            <React.Fragment key={idx}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  margin: '6px 0'
                }}
              >
                <Typography
                  variant="body2"
                  component="pre"
                  sx={{
                    whiteSpace: 'pre-wrap',
                    fontFamily: 'monospace',
                    margin: 0
                  }}
                >
                  {query}
                </Typography>
                <IconButton onClick={() => copyToClipboard(query)} size="small">
                  <ContentCopyIcon />
                </IconButton>
              </div>
              {idx < queries.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default SQLQueries;
