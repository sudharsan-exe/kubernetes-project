const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/calc', (req, res) => {
  const { a, b, op } = req.body;
  const x = Number(a);
  const y = Number(b);
  if (Number.isNaN(x) || Number.isNaN(y)) return res.status(400).json({ error: 'Invalid numbers' });
  let result;
  switch (op) {
    case '+': result = x + y; break;
    case '-': result = x - y; break;
    case '*': result = x * y; break;
    case '/': result = y === 0 ? null : x / y; break;
    case '%': result = x % y; break;
    default: return res.status(400).json({ error: 'Invalid operator' });
  }
  if (result === null) return res.status(400).json({ error: 'Division by zero' });
  res.json({ result });
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server running on port ${port}`));
