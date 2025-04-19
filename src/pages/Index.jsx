
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  CssBaseline, 
  Container, 
  Typography, 
  Stepper, 
  Step, 
  StepLabel, 
  Button, 
  Paper,
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Card,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  ThemeProvider,
  createTheme
} from '@mui/material';
import { 
  Menu as MenuIcon, 
  SmartToy, 
  Build, 
  Psychology,
  Storage,
  PlayArrow,
  Settings,
  CoPresentOutlined,
  ChevronRight,
  FilterNone
} from '@mui/icons-material';

// Import components
import ConversationPanel from '../components/AgentBuilder/ConversationPanel';
import ToolMarketplace from '../components/AgentBuilder/ToolMarketplace';
import KnowledgeBase from '../components/AgentBuilder/KnowledgeBase';
import PromptBuilder from '../components/AgentBuilder/PromptBuilder';
import WorkflowBuilder from '../components/AgentBuilder/WorkflowBuilder';

// Create a custom theme with purple accent
const theme = createTheme({
  palette: {
    primary: {
      main: '#9b87f5',
      dark: '#7E69AB',
      light: '#D6BCFA',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#1A1F2C',
    },
    background: {
      default: '#f8f9fa',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

// Steps for building an agent
const steps = ['Describe Agent', 'Configure Tools', 'Knowledge Base', 'Prompts & Workflow', 'Review & Deploy'];

const Index = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      content: 'Welcome to Agent Whisperer Studio! 👋 I\'ll help you build your custom AI agent. To get started, describe what kind of agent you want to create - what should it do and who is it for?'
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [agentDescription, setAgentDescription] = useState('');
  const [selectedTools, setSelectedTools] = useState([]);
  const [agentConfig, setAgentConfig] = useState({
    name: '',
    purpose: '',
    audience: '',
    tools: [],
    knowledgeBase: [],
    prompts: {
      planner: '',
      generator: ''
    },
    workflow: {
      maxSteps: 5,
      memoryStrategy: 'full'
    }
  });
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [agentReady, setAgentReady] = useState(false);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleSendMessage = (content) => {
    // Add user message
    const userMessage = {
      id: messages.length + 1,
      sender: 'user',
      content
    };
    setMessages(prev => [...prev, userMessage]);
    
    // Set loading state
    setLoading(true);
    
    // If we're in the first step, save the agent description
    if (activeStep === 0 && !agentDescription) {
      setAgentDescription(content);
      
      // Simulate AI response after a delay
      setTimeout(() => {
        handleAIResponse(content);
      }, 1500);
    } else {
      // Simulate AI response after a delay
      setTimeout(() => {
        handleAIResponse(content);
      }, 1500);
    }
  };

  const handleAIResponse = (userMessage) => {
    let aiResponse;
    
    // Generate different AI responses based on the current step
    switch (activeStep) {
      case 0:
        // Initial agent description step
        if (!agentConfig.purpose) {
          // Update agent config with basic details derived from user message
          setAgentConfig(prev => ({
            ...prev,
            purpose: agentDescription || userMessage,
          }));
          
          // First clarifying question about the agent's purpose
          aiResponse = {
            id: messages.length + 2,
            sender: 'ai',
            content: `Thanks for sharing! Let me clarify a few details about your agent. What specific tasks or problems should this agent solve?`,
            options: [
              { label: "Continue", action: () => setActiveStep(1) }
            ]
          };
        } else {
          // Second response with next steps
          aiResponse = {
            id: messages.length + 2,
            sender: 'ai',
            content: `Great! Based on your description, I'll help you build an agent that can ${agentConfig.purpose}. Now, let's configure the tools your agent will need.`,
            options: [
              { label: "Continue to Tool Selection", action: () => setActiveStep(1) }
            ]
          };
        }
        break;
        
      case 1:
        // Tool configuration step
        aiResponse = {
          id: messages.length + 2,
          sender: 'ai',
          content: `I've analyzed your agent requirements and found some useful tools. Please select the tools your agent will need from the marketplace below.`,
          components: (
            <ToolMarketplace 
              onSelect={(tool) => {
                // Toggle tool selection
                if (selectedTools.some(t => t.id === tool.id)) {
                  setSelectedTools(prev => prev.filter(t => t.id !== tool.id));
                } else {
                  setSelectedTools(prev => [...prev, tool]);
                }
              }}
              selectedTools={selectedTools}
            />
          )
        };
        break;
        
      case 2:
        // Knowledge base step
        aiResponse = {
          id: messages.length + 2,
          sender: 'ai',
          content: `Now let's build your agent's knowledge base. You can upload documents or add URLs that contain information your agent should know about.`,
          components: (
            <KnowledgeBase 
              onUpdate={(type) => {
                // Update agent config when knowledge base changes
                setAgentConfig(prev => ({
                  ...prev,
                  knowledgeBase: [...prev.knowledgeBase, type]
                }));
              }}
            />
          )
        };
        break;
        
      case 3:
        // Prompts and workflow step
        aiResponse = {
          id: messages.length + 2,
          sender: 'ai',
          content: `Let's customize how your agent thinks and responds. You can edit the prompts below and configure the agent's workflow.`,
          components: (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <PromptBuilder 
                onUpdate={(prompts) => {
                  setAgentConfig(prev => ({
                    ...prev,
                    prompts
                  }));
                }}
              />
              
              <WorkflowBuilder 
                tools={selectedTools}
                onUpdate={(workflow) => {
                  setAgentConfig(prev => ({
                    ...prev,
                    workflow
                  }));
                }}
              />
            </Box>
          )
        };
        break;
        
      case 4:
        // Review and deploy step
        aiResponse = {
          id: messages.length + 2,
          sender: 'ai',
          content: `Your agent is almost ready! Here's a summary of what we've built together:
          
• Purpose: ${agentConfig.purpose || agentDescription}
• Tools: ${selectedTools.length} tools selected
• Knowledge Base: ${agentConfig.knowledgeBase.length} sources added
• Prompts: Customized for your specific use case
          
Would you like to deploy your agent now?`,
          options: [
            { 
              label: "Deploy Agent", 
              action: () => {
                // Show loading simulation
                setLoading(true);
                
                // Simulate deployment process
                setTimeout(() => {
                  setLoading(false);
                  setShowSuccessDialog(true);
                  setAgentReady(true);
                }, 2500);
              } 
            }
          ]
        };
        break;
        
      default:
        // Default interaction after agent is built
        aiResponse = {
          id: messages.length + 2,
          sender: 'ai',
          content: `Your agent is now ready to use! You can start interacting with it or make further adjustments to its configuration.`
        };
    }
    
    // Add AI response to messages
    setMessages(prev => [...prev, aiResponse]);
    setLoading(false);
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex' }}>
        {/* App Bar */}
        <AppBar 
          position="fixed" 
          sx={{ 
            bgcolor: 'white', 
            color: 'text.primary',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={toggleDrawer}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <SmartToy sx={{ mr: 2, color: '#9b87f5' }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
              Agent Whisperer Studio
            </Typography>
            {agentReady && (
              <Button 
                variant="contained" 
                color="primary" 
                startIcon={<PlayArrow />}
                sx={{ mr: 2 }}
              >
                Test Agent
              </Button>
            )}
            <IconButton color="inherit">
              <Settings />
            </IconButton>
          </Toolbar>
        </AppBar>
        
        {/* Side Drawer */}
        <Drawer
          variant="temporary"
          open={drawerOpen}
          onClose={toggleDrawer}
          sx={{
            width: 280,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: 280,
              boxSizing: 'border-box',
            },
          }}
        >
          <Toolbar>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#9b87f5' }}>
              Agent Studio
            </Typography>
          </Toolbar>
          <Divider />
          <List>
            <ListItem button>
              <ListItemIcon>
                <SmartToy sx={{ color: '#9b87f5' }} />
              </ListItemIcon>
              <ListItemText primary="My Agents" />
            </ListItem>
            <ListItem button>
              <ListItemIcon>
                <Build sx={{ color: '#9b87f5' }} />
              </ListItemIcon>
              <ListItemText primary="Tool Marketplace" />
            </ListItem>
            <ListItem button>
              <ListItemIcon>
                <Psychology sx={{ color: '#9b87f5' }} />
              </ListItemIcon>
              <ListItemText primary="Prompts Library" />
            </ListItem>
            <ListItem button>
              <ListItemIcon>
                <Storage sx={{ color: '#9b87f5' }} />
              </ListItemIcon>
              <ListItemText primary="Knowledge Bases" />
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem button>
              <ListItemIcon>
                <Settings />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItem>
          </List>
        </Drawer>
        
        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            bgcolor: '#f8f9fa',
            minHeight: '100vh',
            pt: { xs: 10, sm: 12 }
          }}
        >
          <Container maxWidth="xl">
            <Box sx={{ mb: 4 }}>
              <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
              
              {activeStep === steps.length ? (
                <Paper sx={{ p: 3, borderRadius: 2, bgcolor: '#f0f4ff', mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Your agent is ready to use!
                  </Typography>
                  <Typography variant="body1" paragraph>
                    You've successfully built your custom AI agent. You can now start using it or make further adjustments.
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ mr: 1 }}
                  >
                    Use My Agent
                  </Button>
                  <Button
                    onClick={() => setActiveStep(0)}
                    sx={{ mr: 1 }}
                  >
                    Build Another Agent
                  </Button>
                </Paper>
              ) : (
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <SmartToy sx={{ mr: 2, color: '#9b87f5' }} />
                    <Typography variant="h5" component="h1" sx={{ fontWeight: 600 }}>
                      {activeStep === 0 && "Create Your AI Agent"}
                      {activeStep === 1 && "Select Agent Tools"}
                      {activeStep === 2 && "Build Knowledge Base"}
                      {activeStep === 3 && "Configure Prompts & Workflow"}
                      {activeStep === 4 && "Review & Deploy Agent"}
                    </Typography>
                  </Box>
                  
                  <Paper 
                    elevation={0} 
                    sx={{ 
                      p: 2, 
                      mb: 3, 
                      bgcolor: '#f0f4ff',
                      border: '1px solid #dce1f9',
                      borderRadius: 2
                    }}
                  >
                    <Typography variant="body1">
                      {activeStep === 0 && "Describe what you want your AI agent to do and who it's for. Be specific about the problems it should solve."}
                      {activeStep === 1 && "Select tools from the marketplace that your agent will need to accomplish its tasks."}
                      {activeStep === 2 && "Upload documents or add URLs to build your agent's knowledge base."}
                      {activeStep === 3 && "Customize how your agent thinks and responds with prompt templates and workflow settings."}
                      {activeStep === 4 && "Review your agent configuration and deploy it to make it available for use."}
                    </Typography>
                  </Paper>
                  
                  <Box sx={{ 
                    display: 'grid', 
                    gridTemplateColumns: { xs: '1fr', md: '3fr 1fr' },
                    gap: 3, 
                    height: 'calc(100vh - 250px)',
                    minHeight: '500px'
                  }}>
                    {/* Conversation Area */}
                    <ConversationPanel 
                      messages={messages}
                      onSendMessage={handleSendMessage}
                      loading={loading}
                      placeholder={activeStep === 0 ? "Describe the agent you want to build..." : "Type your message..."}
                    />
                    
                    {/* Right Sidebar */}
                    <Box>
                      <Card 
                        variant="outlined" 
                        sx={{ 
                          p: 2, 
                          mb: 3,
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column'
                        }}
                      >
                        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                          Agent Building Progress
                        </Typography>
                        
                        <LinearProgress 
                          variant="determinate" 
                          value={(activeStep / steps.length) * 100}
                          sx={{ 
                            height: 8, 
                            borderRadius: 4, 
                            mb: 3,
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: '#9b87f5'
                            }
                          }}
                        />
                        
                        <Box sx={{ flexGrow: 1 }}>
                          <List>
                            <ListItem sx={{ px: 1, py: 0.5 }}>
                              <ListItemIcon sx={{ minWidth: 32 }}>
                                {activeStep > 0 ? <ChevronRight color="primary" /> : <FilterNone color="disabled" />}
                              </ListItemIcon>
                              <ListItemText 
                                primary="Agent Description" 
                                secondary={agentDescription ? `${agentDescription.slice(0, 40)}...` : "Not defined yet"}
                                primaryTypographyProps={{
                                  variant: 'body2',
                                  color: activeStep > 0 ? 'text.primary' : 'text.secondary'
                                }}
                              />
                            </ListItem>
                            
                            <ListItem sx={{ px: 1, py: 0.5 }}>
                              <ListItemIcon sx={{ minWidth: 32 }}>
                                {activeStep > 1 ? <ChevronRight color="primary" /> : <FilterNone color="disabled" />}
                              </ListItemIcon>
                              <ListItemText 
                                primary="Tool Configuration" 
                                secondary={selectedTools.length > 0 ? `${selectedTools.length} tools selected` : "No tools selected"}
                                primaryTypographyProps={{
                                  variant: 'body2',
                                  color: activeStep > 1 ? 'text.primary' : 'text.secondary'
                                }}
                              />
                            </ListItem>
                            
                            <ListItem sx={{ px: 1, py: 0.5 }}>
                              <ListItemIcon sx={{ minWidth: 32 }}>
                                {activeStep > 2 ? <ChevronRight color="primary" /> : <FilterNone color="disabled" />}
                              </ListItemIcon>
                              <ListItemText 
                                primary="Knowledge Base" 
                                secondary={agentConfig.knowledgeBase.length > 0 ? `${agentConfig.knowledgeBase.length} sources added` : "No sources added"}
                                primaryTypographyProps={{
                                  variant: 'body2',
                                  color: activeStep > 2 ? 'text.primary' : 'text.secondary'
                                }}
                              />
                            </ListItem>
                            
                            <ListItem sx={{ px: 1, py: 0.5 }}>
                              <ListItemIcon sx={{ minWidth: 32 }}>
                                {activeStep > 3 ? <ChevronRight color="primary" /> : <FilterNone color="disabled" />}
                              </ListItemIcon>
                              <ListItemText 
                                primary="Prompts & Workflow" 
                                secondary={agentConfig.prompts.planner ? "Customized" : "Default templates"}
                                primaryTypographyProps={{
                                  variant: 'body2',
                                  color: activeStep > 3 ? 'text.primary' : 'text.secondary'
                                }}
                              />
                            </ListItem>
                          </List>
                        </Box>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                          <Button
                            disabled={activeStep === 0}
                            onClick={handleBack}
                          >
                            Back
                          </Button>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={handleNext}
                            disabled={
                              (activeStep === 0 && !agentDescription) ||
                              activeStep === steps.length - 1
                            }
                          >
                            {activeStep === steps.length - 1 ? 'Deploy' : 'Next'}
                          </Button>
                        </Box>
                      </Card>
                    </Box>
                  </Box>
                </Box>
              )}
            </Box>
          </Container>
        </Box>
      </Box>
      
      {/* Success Dialog */}
      <Dialog
        open={showSuccessDialog}
        onClose={() => setShowSuccessDialog(false)}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CoPresentOutlined sx={{ color: '#9b87f5' }} />
            Agent Deployed Successfully!
          </Box>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Congratulations! Your AI agent has been successfully built and deployed. 
            You can now interact with your agent or continue to make refinements.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSuccessDialog(false)}>
            Close
          </Button>
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => {
              setShowSuccessDialog(false);
              setActiveStep(5);
            }}
          >
            Try My Agent
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};

export default Index;
