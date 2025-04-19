
import React, { useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  TextField, 
  Button,
  Tab,
  Tabs,
  Divider,
  Chip,
  IconButton,
  Tooltip,
  Card,
  CardContent
} from '@mui/material';
import { 
  Save, 
  Refresh, 
  HelpOutline, 
  Code, 
  Psychology, 
  Settings 
} from '@mui/icons-material';

const PromptBuilder = ({ onUpdate }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [plannerPrompt, setPlannerPrompt] = useState(
    "You are a helpful assistant that carefully plans responses. First, break down the user's request into steps. Then, gather any necessary information. Finally, provide a comprehensive response that addresses all aspects of the user's query."
  );
  const [generatorPrompt, setGeneratorPrompt] = useState(
    "You are an AI agent designed to help users with their tasks. Be conversational, helpful, and accurate in your responses. Ask clarifying questions when information is missing."
  );
  
  const handleChangeTab = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  const handleSave = () => {
    // Notify parent component of save
    if (onUpdate) {
      onUpdate({
        plannerPrompt,
        generatorPrompt
      });
    }
  };
  
  const resetToDefault = (type) => {
    if (type === 'planner') {
      setPlannerPrompt("You are a helpful assistant that carefully plans responses. First, break down the user's request into steps. Then, gather any necessary information. Finally, provide a comprehensive response that addresses all aspects of the user's query.");
    } else {
      setGeneratorPrompt("You are an AI agent designed to help users with their tasks. Be conversational, helpful, and accurate in your responses. Ask clarifying questions when information is missing.");
    }
  };
  
  // Example variables that could be inserted
  const promptVariables = [
    { name: "{{USER_QUERY}}", description: "The user's current query" },
    { name: "{{AGENT_NAME}}", description: "The name of your agent" },
    { name: "{{PREV_CONTEXT}}", description: "Previous conversation context" },
    { name: "{{TOOLS}}", description: "Available tools list" },
    { name: "{{KNOWLEDGE}}", description: "Knowledge base information" }
  ];
  
  const insertVariable = (variable) => {
    if (activeTab === 0) {
      setPlannerPrompt(prev => prev + ' ' + variable);
    } else {
      setGeneratorPrompt(prev => prev + ' ' + variable);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
        Prompt Builder
      </Typography>
      
      <Tabs 
        value={activeTab} 
        onChange={handleChangeTab} 
        sx={{ 
          mb: 3,
          '& .MuiTabs-indicator': {
            backgroundColor: '#9b87f5',
          },
          '& .Mui-selected': {
            color: '#9b87f5 !important',
          }
        }}
      >
        <Tab 
          icon={<Psychology sx={{ mr: 1 }} />} 
          label="Planner Prompt" 
          iconPosition="start"
        />
        <Tab 
          icon={<Code sx={{ mr: 1 }} />} 
          label="Generator Prompt" 
          iconPosition="start"
        />
        <Tab 
          icon={<Settings sx={{ mr: 1 }} />} 
          label="Advanced Settings" 
          iconPosition="start"
        />
      </Tabs>
      
      <Box sx={{ mb: 3 }}>
        {activeTab === 0 && (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle1" sx={{ flexGrow: 1, fontWeight: 500 }}>
                Planner Prompt
              </Typography>
              <Tooltip title="The planner prompt helps your agent organize its thinking process and plan its responses">
                <IconButton size="small">
                  <HelpOutline fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
            
            <TextField
              fullWidth
              multiline
              rows={8}
              value={plannerPrompt}
              onChange={(e) => setPlannerPrompt(e.target.value)}
              variant="outlined"
              placeholder="Enter your planner prompt here..."
              sx={{ mb: 2 }}
            />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button 
                startIcon={<Refresh />}
                onClick={() => resetToDefault('planner')}
                color="inherit"
              >
                Reset to Default
              </Button>
              
              <Button 
                variant="contained" 
                startIcon={<Save />}
                onClick={handleSave}
                sx={{ 
                  bgcolor: '#9b87f5',
                  '&:hover': {
                    bgcolor: '#7E69AB',
                  }
                }}
              >
                Save Prompt
              </Button>
            </Box>
          </>
        )}
        
        {activeTab === 1 && (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle1" sx={{ flexGrow: 1, fontWeight: 500 }}>
                Generator Prompt
              </Typography>
              <Tooltip title="The generator prompt defines your agent's personality and response style">
                <IconButton size="small">
                  <HelpOutline fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
            
            <TextField
              fullWidth
              multiline
              rows={8}
              value={generatorPrompt}
              onChange={(e) => setGeneratorPrompt(e.target.value)}
              variant="outlined"
              placeholder="Enter your generator prompt here..."
              sx={{ mb: 2 }}
            />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button 
                startIcon={<Refresh />}
                onClick={() => resetToDefault('generator')}
                color="inherit"
              >
                Reset to Default
              </Button>
              
              <Button 
                variant="contained" 
                startIcon={<Save />}
                onClick={handleSave}
                sx={{ 
                  bgcolor: '#9b87f5',
                  '&:hover': {
                    bgcolor: '#7E69AB',
                  }
                }}
              >
                Save Prompt
              </Button>
            </Box>
          </>
        )}
        
        {activeTab === 2 && (
          <Card variant="outlined" sx={{ bgcolor: '#f8f9fa', mb: 3 }}>
            <CardContent>
              <Typography color="text.secondary" sx={{ mb: 2 }}>
                Advanced settings coming soon. Stay tuned for more customization options!
              </Typography>
            </CardContent>
          </Card>
        )}
      </Box>
      
      <Divider sx={{ my: 3 }} />
      
      <Box>
        <Typography variant="subtitle2" sx={{ mb: 2 }}>
          Available Variables
        </Typography>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {promptVariables.map((variable, index) => (
            <Tooltip key={index} title={variable.description} placement="top">
              <Chip 
                label={variable.name} 
                onClick={() => insertVariable(variable.name)}
                sx={{ 
                  bgcolor: '#f0f4ff',
                  '&:hover': {
                    bgcolor: '#dce1f9',
                  }
                }}
              />
            </Tooltip>
          ))}
        </Box>
      </Box>
    </Paper>
  );
};

export default PromptBuilder;
