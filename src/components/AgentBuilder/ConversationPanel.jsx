
import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Paper, 
  Typography, 
  Avatar, 
  CircularProgress,
  Divider
} from '@mui/material';
import { Send } from '@mui/icons-material';

const ConversationPanel = ({ 
  messages, 
  onSendMessage, 
  inputDisabled = false, 
  loading = false,
  placeholder = "Type a message..."
}) => {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);
  
  const handleSend = () => {
    if (inputValue.trim() && !inputDisabled) {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <Paper elevation={3} sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%', 
      borderRadius: 2,
      bgcolor: 'background.paper'
    }}>
      <Box sx={{ 
        flexGrow: 1, 
        overflow: 'auto', 
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 2
      }}>
        {messages.map((message, index) => (
          <Box 
            key={index} 
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              mb: 2,
              ...(message.sender === 'user' ? {
                alignSelf: 'flex-end',
                flexDirection: 'row-reverse'
              } : {})
            }}
          >
            <Avatar 
              sx={{ 
                bgcolor: message.sender === 'user' ? '#7E69AB' : '#9b87f5',
                width: 36,
                height: 36,
                mr: message.sender === 'user' ? 0 : 2,
                ml: message.sender === 'user' ? 2 : 0
              }}
            >
              {message.sender === 'user' ? 'U' : 'AI'}
            </Avatar>
            <Paper 
              elevation={1} 
              sx={{ 
                p: 2, 
                borderRadius: 2,
                maxWidth: '70%',
                bgcolor: message.sender === 'user' ? '#f0f4ff' : '#fff'
              }}
            >
              <Typography variant="body1" component="div">
                {message.content}
              </Typography>
              {message.options && (
                <Box sx={{ mt: 2 }}>
                  {message.options.map((option, idx) => (
                    <Button 
                      key={idx}
                      variant="outlined"
                      size="small"
                      sx={{ mr: 1, mb: 1 }}
                      onClick={() => option.action(option.label)}
                    >
                      {option.label}
                    </Button>
                  ))}
                </Box>
              )}
              {message.components && (
                <Box sx={{ mt: 2 }}>
                  {message.components}
                </Box>
              )}
            </Paper>
          </Box>
        ))}
        {loading && (
          <Box sx={{ display: 'flex', alignItems: 'center', ml: 7 }}>
            <CircularProgress size={20} sx={{ mr: 2 }} />
            <Typography variant="body2" color="text.secondary">
              Agent is thinking...
            </Typography>
          </Box>
        )}
        <div ref={messagesEndRef} />
      </Box>
      <Divider />
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
        <TextField
          fullWidth
          multiline
          maxRows={4}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          disabled={inputDisabled}
          sx={{ mr: 2 }}
          variant="outlined"
        />
        <Button 
          variant="contained" 
          color="primary" 
          endIcon={<Send />}
          onClick={handleSend}
          disabled={inputDisabled || !inputValue.trim()}
          sx={{ 
            bgcolor: '#9b87f5',
            '&:hover': {
              bgcolor: '#7E69AB',
            },
            px: 3,
            py: 1.5
          }}
        >
          Send
        </Button>
      </Box>
    </Paper>
  );
};

export default ConversationPanel;
