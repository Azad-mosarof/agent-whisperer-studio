
import React, { useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Button, 
  Divider,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  IconButton,
  LinearProgress,
  Chip
} from '@mui/material';
import { 
  Upload, 
  Description, 
  Delete, 
  CheckCircle, 
  Link
} from '@mui/icons-material';

const KnowledgeBase = ({ onUpdate }) => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [urls, setUrls] = useState([]);
  const [urlInput, setUrlInput] = useState('');
  const [uploadProgress, setUploadProgress] = useState(null);

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    
    // Simulate file upload progress
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          
          // Add files to state after "upload" completes
          setUploadedFiles(prev => [
            ...prev, 
            ...files.map(file => ({
              id: Date.now() + Math.random(),
              name: file.name,
              size: file.size,
              type: file.type,
              dateAdded: new Date(),
              processed: true
            }))
          ]);
          
          return null;
        }
        return prev + 5;
      });
    }, 150);
  };

  const handleUrlAdd = () => {
    if (urlInput.trim() && isValidUrl(urlInput)) {
      setUrls([...urls, { 
        id: Date.now(),
        url: urlInput.trim(),
        dateAdded: new Date(),
        processed: true
      }]);
      setUrlInput('');
      
      // Notify parent component
      if (onUpdate) {
        onUpdate('url-added');
      }
    }
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleDeleteFile = (id) => {
    setUploadedFiles(uploadedFiles.filter(file => file.id !== id));
    
    // Notify parent component
    if (onUpdate) {
      onUpdate('file-removed');
    }
  };

  const handleDeleteUrl = (id) => {
    setUrls(urls.filter(url => url.id !== id));
    
    // Notify parent component
    if (onUpdate) {
      onUpdate('url-removed');
    }
  };

  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
        Knowledge Base
      </Typography>
      
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
          Upload Documents
        </Typography>
        
        <Box
          sx={{
            border: '2px dashed #9b87f5',
            borderRadius: 2,
            p: 3,
            textAlign: 'center',
            bgcolor: '#f8f9fa',
            mb: 2
          }}
        >
          <input
            accept=".pdf,.doc,.docx,.txt,.csv"
            style={{ display: 'none' }}
            id="file-upload"
            type="file"
            multiple
            onChange={handleFileUpload}
          />
          <label htmlFor="file-upload">
            <Button
              component="span"
              variant="contained"
              startIcon={<Upload />}
              sx={{ 
                mb: 2,
                bgcolor: '#9b87f5',
                '&:hover': {
                  bgcolor: '#7E69AB',
                }
              }}
            >
              Choose Files
            </Button>
          </label>
          <Typography variant="body2" color="text.secondary">
            Drag and drop files or click to upload
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
            Supported formats: PDF, DOC, DOCX, TXT, CSV
          </Typography>
        </Box>
        
        {uploadProgress !== null && (
          <Box sx={{ mb: 2 }}>
            <LinearProgress 
              variant="determinate" 
              value={uploadProgress} 
              sx={{ 
                height: 8, 
                borderRadius: 4,
                '& .MuiLinearProgress-bar': {
                  backgroundColor: '#9b87f5'
                }
              }} 
            />
            <Typography variant="caption" sx={{ display: 'block', mt: 1, textAlign: 'right' }}>
              Uploading... {uploadProgress}%
            </Typography>
          </Box>
        )}
        
        {uploadedFiles.length > 0 && (
          <List>
            {uploadedFiles.map((file) => (
              <ListItem 
                key={file.id}
                sx={{
                  mb: 1,
                  bgcolor: '#f8f9fa',
                  borderRadius: 1,
                }}
              >
                <ListItemIcon>
                  <Description sx={{ color: '#9b87f5' }} />
                </ListItemIcon>
                <ListItemText 
                  primary={file.name}
                  secondary={`${formatBytes(file.size)} • Added ${file.dateAdded.toLocaleDateString()}`}
                />
                <ListItemSecondaryAction>
                  {file.processed && (
                    <Chip 
                      icon={<CheckCircle fontSize="small" />}
                      label="Processed" 
                      size="small"
                      sx={{ 
                        mr: 1,
                        bgcolor: '#e8f5e9',
                        color: '#2e7d32',
                      }}
                    />
                  )}
                  <IconButton 
                    edge="end" 
                    aria-label="delete"
                    onClick={() => handleDeleteFile(file.id)}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        )}
      </Box>
      
      <Divider sx={{ my: 3 }} />
      
      <Box>
        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
          Add URLs
        </Typography>
        
        <Box sx={{ display: 'flex', mb: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="https://example.com"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            error={urlInput.trim() !== '' && !isValidUrl(urlInput)}
            helperText={urlInput.trim() !== '' && !isValidUrl(urlInput) ? "Please enter a valid URL" : ""}
            size="small"
            sx={{ mr: 2 }}
          />
          <Button
            variant="contained"
            startIcon={<Link />}
            onClick={handleUrlAdd}
            disabled={!urlInput.trim() || !isValidUrl(urlInput)}
            sx={{ 
              whiteSpace: 'nowrap',
              bgcolor: '#9b87f5',
              '&:hover': {
                bgcolor: '#7E69AB',
              }
            }}
          >
            Add URL
          </Button>
        </Box>
        
        {urls.length > 0 && (
          <List>
            {urls.map((urlItem) => (
              <ListItem 
                key={urlItem.id}
                sx={{
                  mb: 1,
                  bgcolor: '#f8f9fa',
                  borderRadius: 1,
                }}
              >
                <ListItemIcon>
                  <Link sx={{ color: '#9b87f5' }} />
                </ListItemIcon>
                <ListItemText 
                  primary={urlItem.url}
                  secondary={`Added ${urlItem.dateAdded.toLocaleDateString()}`}
                  primaryTypographyProps={{
                    style: {
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }
                  }}
                />
                <ListItemSecondaryAction>
                  {urlItem.processed && (
                    <Chip 
                      icon={<CheckCircle fontSize="small" />}
                      label="Indexed" 
                      size="small"
                      sx={{ 
                        mr: 1,
                        bgcolor: '#e8f5e9',
                        color: '#2e7d32',
                      }}
                    />
                  )}
                  <IconButton 
                    edge="end" 
                    aria-label="delete"
                    onClick={() => handleDeleteUrl(urlItem.id)}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </Paper>
  );
};

export default KnowledgeBase;
