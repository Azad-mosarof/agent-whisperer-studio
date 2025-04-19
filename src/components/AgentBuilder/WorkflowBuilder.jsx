
import React, { useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Card, 
  CardContent,
  Divider,
  Button,
  Switch,
  FormControlLabel,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { 
  ArrowDownward,
  Settings
} from '@mui/icons-material';

const WorkflowBuilder = ({ tools = [], onUpdate }) => {
  const [advancedMode, setAdvancedMode] = useState(false);
  const [maxSteps, setMaxSteps] = useState(5);
  const [memoryStrategy, setMemoryStrategy] = useState('full');
  
  const handleModeChange = (event) => {
    setAdvancedMode(event.target.checked);
  };
  
  const handleMaxStepsChange = (event) => {
    setMaxSteps(parseInt(event.target.value) || 5);
  };
  
  const handleMemoryStrategyChange = (event) => {
    setMemoryStrategy(event.target.value);
  };
  
  const handleSaveWorkflow = () => {
    if (onUpdate) {
      onUpdate({
        advancedMode,
        maxSteps,
        memoryStrategy
      });
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Workflow Builder
        </Typography>
        
        <FormControlLabel
          control={
            <Switch 
              checked={advancedMode} 
              onChange={handleModeChange}
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
          label="Advanced Mode"
        />
      </Box>
      
      <Box sx={{ mb: 4 }}>
        <Card variant="outlined" sx={{ borderRadius: 2, mb: 2, bgcolor: '#f8f9fa', borderColor: '#e0e0e0' }}>
          <CardContent sx={{ textAlign: 'center', py: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 500, color: '#9b87f5' }}>
              User Input
            </Typography>
          </CardContent>
        </Card>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 1 }}>
          <ArrowDownward sx={{ color: '#9b87f5' }} />
        </Box>
        
        <Card variant="outlined" sx={{ borderRadius: 2, mb: 2, bgcolor: '#f0f4ff', borderColor: '#9b87f5' }}>
          <CardContent sx={{ textAlign: 'center', py: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 500, color: '#7E69AB' }}>
              Plan Generation
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Agent analyzes the request and creates a plan
            </Typography>
          </CardContent>
        </Card>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 1 }}>
          <ArrowDownward sx={{ color: '#9b87f5' }} />
        </Box>
        
        <Card variant="outlined" sx={{ borderRadius: 2, mb: 2, bgcolor: '#f8f9fa', borderColor: '#e0e0e0' }}>
          <CardContent sx={{ textAlign: 'center', py: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
              Tool Execution
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {tools.length > 0 ? 
                `Uses selected tools (${tools.length} configured)` : 
                "No tools configured yet"}
            </Typography>
          </CardContent>
        </Card>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 1 }}>
          <ArrowDownward sx={{ color: '#9b87f5' }} />
        </Box>
        
        <Card variant="outlined" sx={{ borderRadius: 2, mb: 2, bgcolor: '#f0f4ff', borderColor: '#9b87f5' }}>
          <CardContent sx={{ textAlign: 'center', py: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 500, color: '#7E69AB' }}>
              Knowledge Integration
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Combines tool results with knowledge base
            </Typography>
          </CardContent>
        </Card>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 1 }}>
          <ArrowDownward sx={{ color: '#9b87f5' }} />
        </Box>
        
        <Card variant="outlined" sx={{ borderRadius: 2, mb: 2, bgcolor: '#f8f9fa', borderColor: '#e0e0e0' }}>
          <CardContent sx={{ textAlign: 'center', py: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
              Response Generation
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Creates the final response to the user
            </Typography>
          </CardContent>
        </Card>
      </Box>
      
      {advancedMode && (
        <>
          <Divider sx={{ my: 3 }} />
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Settings fontSize="small" />
              Advanced Configuration
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                label="Max Execution Steps"
                type="number"
                value={maxSteps}
                onChange={handleMaxStepsChange}
                InputProps={{ inputProps: { min: 1, max: 10 } }}
                size="small"
                sx={{ width: '50%' }}
              />
              
              <FormControl size="small" sx={{ width: '50%' }}>
                <InputLabel>Memory Strategy</InputLabel>
                <Select
                  value={memoryStrategy}
                  label="Memory Strategy"
                  onChange={handleMemoryStrategyChange}
                >
                  <MenuItem value="summary">Summary Only</MenuItem>
                  <MenuItem value="recent">Recent History</MenuItem>
                  <MenuItem value="full">Full History</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
        </>
      )}
      
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button 
          variant="contained"
          onClick={handleSaveWorkflow}
          sx={{ 
            bgcolor: '#9b87f5',
            '&:hover': {
              bgcolor: '#7E69AB',
            }
          }}
        >
          Save Workflow
        </Button>
      </Box>
    </Paper>
  );
};

export default WorkflowBuilder;
