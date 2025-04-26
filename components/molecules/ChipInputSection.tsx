import React from 'react';
import { Box, Typography, TextField, IconButton, Chip, Divider } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

interface ChipInputSectionProps {
  title: string;
  description: string;
  items: string[];
  onAdd: () => void;
  onRemove: (item: string) => void;
  inputValue: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  inputLabel: string;
  divider?: boolean;
}

const ChipInputSection: React.FC<ChipInputSectionProps> = ({
  title,
  description,
  items,
  onAdd,
  onRemove,
  inputValue,
  onInputChange,
  inputLabel,
  divider = true,
}) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onAdd();
    }
  };

  return (
    <>
      {divider && <Divider sx={{ my: 2 }} />}
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        {description}
      </Typography>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2, mt: 1 }}>
        {(items || []).map((item, index) => (
          <Chip key={index} label={item} onDelete={() => onRemove(item)} />
        ))}
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <TextField
          label={inputLabel}
          value={inputValue}
          onChange={onInputChange}
          onKeyPress={handleKeyPress}
          size="small"
          fullWidth
        />
        <IconButton color="primary" onClick={onAdd} sx={{ ml: 1 }}>
          <AddIcon />
        </IconButton>
      </Box>
    </>
  );
};

export { ChipInputSection };
