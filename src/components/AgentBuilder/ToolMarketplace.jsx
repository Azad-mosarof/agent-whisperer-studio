
import React, { useState } from 'react';
import { 
  Box,
  Paper,
  Typography,
  TextField,
  InputAdornment,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  Button,
  Switch,
  FormControlLabel,
  CircularProgress
} from '@mui/material';
import { Search, Check, Add } from '@mui/icons-material';

// Mock tool data
const mockTools = [
  {
    id: 1,
    name: 'Web Search',
    description: 'Search the web for up-to-date information',
    category: 'Information Retrieval',
    popular: true,
    configurable: true
  },
  {
    id: 2,
    name: 'Document Analysis',
    description: 'Extract insights from documents and PDFs',
    category: 'Data Processing',
    popular: true,
    configurable: true
  },
  {
    id: 3,
    name: 'Code Interpreter',
    description: 'Run code and analyze data with Python',
    category: 'Development',
    popular: true,
    configurable: false
  },
  {
    id: 4,
    name: 'Email Integration',
    description: 'Send and analyze emails',
    category: 'Communication',
    popular: false,
    configurable: true
  },
  {
    id: 5,
    name: 'Image Generator',
    description: 'Generate images from text descriptions',
    category: 'Creative',
    popular: true,
    configurable: true
  },
  {
    id: 6,
    name: 'Weather API',
    description: 'Get real-time weather data',
    category: 'Information Retrieval',
    popular: false,
    configurable: true
  }
];

const ToolMarketplace = ({ onSelect, selectedTools = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [availableTools, setAvailableTools] = useState(mockTools);
  
  const handleSearch = () => {
    setLoading(true);
    
    // Simulate search delay
    setTimeout(() => {
      const filtered = mockTools.filter(tool => 
        tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setAvailableTools(filtered);
      setLoading(false);
    }, 800);
  };

  const isSelected = (toolId) => {
    return selectedTools.some(tool => tool.id === toolId);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Tool Marketplace
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search for tools..."
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Button 
                  variant="contained" 
                  onClick={handleSearch}
                  sx={{ 
                    bgcolor: '#9b87f5',
                    '&:hover': {
                      bgcolor: '#7E69AB',
                    }
                  }}
                >
                  <Search />
                </Button>
              </InputAdornment>
            ),
          }}
        />
      </Box>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress size={40} sx={{ color: '#9b87f5' }} />
        </Box>
      ) : (
        <Grid container spacing={2}>
          {availableTools.map((tool) => (
            <Grid item xs={12} sm={6} md={4} key={tool.id}>
              <Card 
                elevation={2} 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  borderRadius: 2,
                  position: 'relative',
                  border: isSelected(tool.id) ? '2px solid #9b87f5' : 'none'
                }}
              >
                {tool.popular && (
                  <Chip 
                    label="Popular" 
                    size="small" 
                    sx={{ 
                      position: 'absolute', 
                      top: 10, 
                      right: 10,
                      bgcolor: '#f8f4ff',
                      color: '#7E69AB',
                      fontWeight: 'bold'
                    }} 
                  />
                )}
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                    {tool.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {tool.description}
                  </Typography>
                  <Chip 
                    label={tool.category} 
                    size="small" 
                    sx={{ 
                      bgcolor: '#f0f4ff',
                      color: '#5d6b98'
                    }} 
                  />
                </CardContent>
                <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
                  {isSelected(tool.id) ? (
                    <Button 
                      variant="outlined"
                      color="primary"
                      startIcon={<Check />}
                      onClick={() => onSelect(tool)}
                      sx={{ 
                        borderColor: '#9b87f5',
                        color: '#9b87f5',
                        "&:hover": {
                          borderColor: '#7E69AB',
                          bgcolor: 'rgba(126, 105, 171, 0.04)'
                        }
                      }}
                    >
                      Selected
                    </Button>
                  ) : (
                    <Button 
                      variant="outlined"
                      startIcon={<Add />}
                      onClick={() => onSelect(tool)}
                      sx={{ 
                        borderColor: '#9b87f5',
                        color: '#9b87f5',
                        "&:hover": {
                          borderColor: '#7E69AB',
                          bgcolor: 'rgba(126, 105, 171, 0.04)'
                        }
                      }}
                    >
                      Add Tool
                    </Button>
                  )}
                  
                  {tool.configurable && (
                    <FormControlLabel
                      control={
                        <Switch 
                          size="small" 
                          disabled={!isSelected(tool.id)}
                          sx={{
                            '& .MuiSwitch-switchBase.Mui-checked': {
                              color: '#9b87f5',
                            },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                              backgroundColor: '#9b87f5',
                            },
                          }}
                        />
                      }
                      label={
                        <Typography variant="body2" color="text.secondary">
                          Configure
                        </Typography>
                      }
                      labelPlacement="start"
                    />
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Paper>
  );
};

export default ToolMarketplace;
