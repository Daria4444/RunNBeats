import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  Button,
} from '@mui/material';

export default function Feedback() {
  const [formData, setFormData] = useState({
    satisfaction: '',
    userType: '',
    agree: false,
    comments: '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/runner/feedback/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json',
                  'Authorization': `Bearer ${localStorage.getItem('token')}`},
        body: JSON.stringify(formData),
      });

      const result = await response.text();
      if (response.ok) {
        alert('Feedback sent!');
      } else {
        alert('Failed: ' + result);
      }
    } catch (error) {
      console.error(error);
      alert('Server error!');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Box
        sx={{
          backgroundColor: 'white',
          padding: '32px',
          borderRadius: '12px',
          boxShadow: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          width: '100%',
          maxWidth: '500px',
        }}
      >
        <Typography variant="h5" fontWeight={600}>
          Feedback Form
        </Typography>

        {/* Select */}
        <FormControl fullWidth>
          <InputLabel>Satisfaction</InputLabel>
          <Select
            name="satisfaction"
            value={formData.satisfaction}
            onChange={handleChange}
          >
            <MenuItem value="very_satisfied">Very satisfied</MenuItem>
            <MenuItem value="satisfied">Satisfied</MenuItem>
            <MenuItem value="neutral">Neutral</MenuItem>
            <MenuItem value="dissatisfied">Dissatisfied</MenuItem>
          </Select>
        </FormControl>

        {/* Radio */}
        <FormControl>
          <Typography>What type of user are you?</Typography>
          <RadioGroup
            name="userType"
            value={formData.userType}
            onChange={handleChange}
          >
            <FormControlLabel value="runner" control={<Radio />} label="Runner" />
            <FormControlLabel value="coach" control={<Radio />} label="Coach" />
            <FormControlLabel value="visitor" control={<Radio />} label="Visitor" />
          </RadioGroup>
        </FormControl>

        {/* Checkbox */}
        <FormControlLabel
          control={
            <Checkbox
              name="agree"
              checked={formData.agree}
              onChange={handleChange}
            />
          }
          label="I agree to share my feedback"
        />

        {/* Textarea */}
        <TextField
          name="comments"
          label="Additional comments"
          multiline
          rows={4}
          value={formData.comments}
          onChange={handleChange}
          fullWidth
        />

        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{
            backgroundColor: '#5D63D1',
            '&:hover': { backgroundColor: '#4f46e5' },
          }}
        >
          Submit Feedback
        </Button>
      </Box>
    </Box>
  );
}
