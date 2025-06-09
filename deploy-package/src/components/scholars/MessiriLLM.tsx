import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Tabs,
  Tab,
  Box,
  TextField,
  Button,
  Grid,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { FarouqService, Scholar, KnowledgeDomain, ScholarQueryResponse, ContentVerificationResult } from '../../services/FarouqService';
import SendIcon from '@mui/icons-material/Send';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ExploreIcon from '@mui/icons-material/Explore';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: theme.spacing(1),
}));

const QueryField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: theme.palette.primary.light,
    },
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.dark,
    },
  },
}));

const VerificationResult = styled(Box)(({ theme, severity }: { theme: any, severity: 'success' | 'warning' | 'error' }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.spacing(1),
  marginTop: theme.spacing(2),
  backgroundColor: 
    severity === 'success' ? theme.palette.success.light : 
    severity === 'warning' ? theme.palette.warning.light : 
    theme.palette.error.light,
}));

const ResultPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  minHeight: '200px',
  maxHeight: '500px',
  overflowY: 'auto',
  marginTop: theme.spacing(2),
  backgroundColor: theme.palette.background.default,
  border: `1px solid ${theme.palette.divider}`,
}));

const ReferenceItem = styled(ListItem)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  marginBottom: theme.spacing(1),
  borderRadius: theme.spacing(1),
  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
}));

// TabPanel component for tab content
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`messiri-tabpanel-${index}`}
      aria-labelledby={`messiri-tab-${index}`}
      {...other}
      sx={{ mt: 2 }}
    >
      {value === index && <Box>{children}</Box>}
    </Box>
  );
}

// Main component
const MessiriLLM: React.FC = () => {
  // State
  const [tabValue, setTabValue] = useState(0);
  const [question, setQuestion] = useState('');
  const [contentToVerify, setContentToVerify] = useState('');
  const [concept, setConcept] = useState('');
  const [queryResponse, setQueryResponse] = useState<ScholarQueryResponse | null>(null);
  const [verificationResult, setVerificationResult] = useState<ContentVerificationResult | null>(null);
  const [conceptResults, setConceptResults] = useState<any>(null);
  const [selectedWork, setSelectedWork] = useState('');
  const [workResults, setWorkResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Effect to load works on component mount
  useEffect(() => {
    fetchWorks();
  }, []);

  // Handlers
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleQuestionSubmit = async () => {
    if (!question.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await FarouqService.getInstance().queryScholar(question, Scholar.MESSIRI);
      setQueryResponse(response);
    } catch (err: any) {
      setError(err.message || 'Failed to get response from scholar');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationSubmit = async () => {
    if (!contentToVerify.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await FarouqService.getInstance().verifyContentWithScholar(
        contentToVerify,
        Scholar.MESSIRI
      );
      setVerificationResult(result);
    } catch (err: any) {
      setError(err.message || 'Failed to verify content');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleConceptExplore = async () => {
    if (!concept.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const results = await FarouqService.getInstance().exploreScholarConcept(
        concept,
        Scholar.MESSIRI
      );
      setConceptResults(results);
    } catch (err: any) {
      setError(err.message || 'Failed to explore concept');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchWorks = async () => {
    try {
      const works = FarouqService.getInstance().getScholarWorks(Scholar.MESSIRI);
      return works;
    } catch (err: any) {
      console.error('Failed to fetch works', err);
      return [];
    }
  };

  const handleWorkSelect = async (workId: string) => {
    setSelectedWork(workId);
    setLoading(true);
    setError(null);
    
    try {
      // Simulate fetching work details
      setTimeout(() => {
        setWorkResults({
          id: workId,
          title: 'موسوعة اليهود واليهودية والصهيونية',
          description: 'موسوعة شاملة تتناول تاريخ اليهود والفكر اليهودي والحركة الصهيونية من منظور نقدي',
          volumes: 8,
          concepts: [
            'الجماعات الوظيفية',
            'العلمانية الشاملة',
            'النموذج المعرفي',
            'الصهيونية الاستيطانية'
          ],
          excerpts: [
            {
              text: 'ظهرت الصهيونية كحركة استيطانية في سياق الاستعمار الغربي الحديث...',
              page: 145,
              volume: 3
            },
            {
              text: 'يمكن فهم الحضارة الغربية الحديثة من خلال نموذج الحلولية المادية...',
              page: 267,
              volume: 2
            }
          ]
        });
        setLoading(false);
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch work details');
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom align="center" fontWeight="bold" color="primary">
        خدمة فاروق العلمية - عبدالوهاب المسيري
      </Typography>
      
      <Typography variant="subtitle1" align="center" paragraph sx={{ mb: 4 }}>
        استكشف أعمال وأفكار الدكتور عبدالوهاب المسيري، أحد أبرز المفكرين العرب المعاصرين
      </Typography>
      
      <StyledPaper elevation={3}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            centered
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab label="اسأل المسيري" icon={<SendIcon />} iconPosition="start" />
            <Tab label="تحقق من المحتوى" icon={<CheckCircleIcon />} iconPosition="start" />
            <Tab label="استكشف المفاهيم" icon={<ExploreIcon />} iconPosition="start" />
            <Tab label="تصفح المؤلفات" icon={<LibraryBooksIcon />} iconPosition="start" />
          </Tabs>
        </Box>
        
        {/* Ask Al-Messiri Tab */}
        <TabPanel value={tabValue} index={0}>
          <Typography variant="h6" gutterBottom>
            اطرح سؤالًا على الدكتور المسيري
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            يمكنك طرح أي سؤال حول الفلسفة، النقد الحضاري، الصهيونية، العلمانية، أو الفكر الإسلامي المعاصر
          </Typography>
          
          <QueryField
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            placeholder="اكتب سؤالك هنا..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            dir="rtl"
          />
          
          <Button 
            variant="contained" 
            color="primary" 
            endIcon={<SendIcon />}
            onClick={handleQuestionSubmit}
            disabled={loading || !question.trim()}
          >
            إرسال السؤال
          </Button>
          
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <CircularProgress />
            </Box>
          )}
          
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          
          {queryResponse && (
            <ResultPaper elevation={1}>
              <Typography variant="h6" gutterBottom>إجابة المسيري:</Typography>
              <Typography variant="body1" paragraph dir="rtl">
                {queryResponse.answer}
              </Typography>
              
              {queryResponse.references?.length > 0 && (
                <>
                  <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>المصادر:</Typography>
                  <List>
                    {queryResponse.references.map((ref, index) => (
                      <ReferenceItem key={index}>
                        <ListItemText
                          primary={ref.work}
                          secondary={
                            <>
                              <Typography component="span" variant="body2" color="text.primary" dir="rtl">
                                {ref.excerpt}
                              </Typography>
                              <br />
                              {ref.volume && <span>المجلد: {ref.volume}, </span>}
                              {ref.page && <span>الصفحة: {ref.page}</span>}
                            </>
                          }
                        />
                      </ReferenceItem>
                    ))}
                  </List>
                </>
              )}
              
              {queryResponse.confidence && (
                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    مستوى الثقة في الإجابة: {Math.round(queryResponse.confidence * 100)}%
                  </Typography>
                </Box>
              )}
            </ResultPaper>
          )}
        </TabPanel>
        
        {/* Verify Content Tab */}
        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6" gutterBottom>
            تحقق من توافق المحتوى مع فكر المسيري
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            أدخل نصًا للتحقق من مدى توافقه مع آراء وأفكار الدكتور عبدالوهاب المسيري
          </Typography>
          
          <QueryField
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            placeholder="أدخل النص للتحقق منه..."
            value={contentToVerify}
            onChange={(e) => setContentToVerify(e.target.value)}
            dir="rtl"
          />
          
          <Button 
            variant="contained" 
            color="primary" 
            endIcon={<CheckCircleIcon />}
            onClick={handleVerificationSubmit}
            disabled={loading || !contentToVerify.trim()}
          >
            تحقق من المحتوى
          </Button>
          
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <CircularProgress />
            </Box>
          )}
          
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          
          {verificationResult && (
            <ResultPaper elevation={1}>
              <Typography variant="h6" gutterBottom>نتيجة التحقق:</Typography>
              
              <VerificationResult 
                severity={
                  verificationResult.verificationStatus === 'fully_aligned' ? 'success' : 
                  verificationResult.verificationStatus === 'partially_aligned' ? 'warning' : 
                  'error'
                }
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {verificationResult.verificationStatus === 'fully_aligned' ? (
                    <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                  ) : verificationResult.verificationStatus === 'partially_aligned' ? (
                    <CheckCircleIcon color="warning" sx={{ mr: 1 }} />
                  ) : (
                    <CancelIcon color="error" sx={{ mr: 1 }} />
                  )}
                  <Typography variant="subtitle1" fontWeight="bold">
                    {verificationResult.verificationStatus === 'fully_aligned' 
                      ? 'المحتوى متوافق تمامًا مع فكر المسيري' 
                      : verificationResult.verificationStatus === 'partially_aligned'
                      ? 'المحتوى متوافق جزئيًا مع فكر المسيري'
                      : 'المحتوى غير متوافق مع فكر المسيري'
                    }
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ mt: 1 }} dir="rtl">
                  {verificationResult.analysis}
                </Typography>
              </VerificationResult>
              
              {verificationResult.alignedConcepts?.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2">المفاهيم المتوافقة:</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                    {verificationResult.alignedConcepts.map((concept, index) => (
                      <Chip key={index} label={concept} color="success" size="small" />
                    ))}
                  </Box>
                </Box>
              )}
              
              {verificationResult.misalignedConcepts?.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2">المفاهيم غير المتوافقة:</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                    {verificationResult.misalignedConcepts.map((concept, index) => (
                      <Chip key={index} label={concept} color="error" size="small" />
                    ))}
                  </Box>
                </Box>
              )}
              
              {verificationResult.scholarReferences?.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2">المراجع من أعمال المسيري:</Typography>
                  <List>
                    {verificationResult.scholarReferences.map((ref, index) => (
                      <ReferenceItem key={index}>
                        <ListItemText
                          primary={ref.work}
                          secondary={
                            <>
                              <Typography component="span" variant="body2" color="text.primary" dir="rtl">
                                {ref.excerpt}
                              </Typography>
                              <br />
                              {ref.volume && <span>المجلد: {ref.volume}, </span>}
                              {ref.page && <span>الصفحة: {ref.page}</span>}
                            </>
                          }
                        />
                      </ReferenceItem>
                    ))}
                  </List>
                </Box>
              )}
            </ResultPaper>
          )}
        </TabPanel>
        
        {/* Explore Concepts Tab */}
        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" gutterBottom>
            استكشف مفاهيم المسيري
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            ابحث في المفاهيم والمصطلحات التي طورها الدكتور عبدالوهاب المسيري في أعماله
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={9}>
              <QueryField
                fullWidth
                variant="outlined"
                placeholder="أدخل مفهومًا للبحث..."
                value={concept}
                onChange={(e) => setConcept(e.target.value)}
                dir="rtl"
              />
            </Grid>
            <Grid item xs={3}>
              <Button 
                variant="contained" 
                color="primary" 
                endIcon={<ExploreIcon />}
                onClick={handleConceptExplore}
                disabled={loading || !concept.trim()}
                sx={{ height: '56px' }}
                fullWidth
              >
                استكشف
              </Button>
            </Grid>
          </Grid>
          
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <CircularProgress />
            </Box>
          )}
          
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          
          {conceptResults && (
            <ResultPaper elevation={1}>
              <Typography variant="h6" gutterBottom>{conceptResults.concept}</Typography>
              <Typography variant="body1" paragraph dir="rtl">
                {conceptResults.description}
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="subtitle2" gutterBottom>الظهور في أعمال المسيري:</Typography>
              <List>
                {conceptResults.appearances?.map((appearance: any, index: number) => (
                  <ReferenceItem key={index}>
                    <ListItemText
                      primary={appearance.work}
                      secondary={
                        <>
                          <Typography component="span" variant="body2" color="text.primary" dir="rtl">
                            {appearance.context}
                          </Typography>
                          <br />
                          {appearance.volume && <span>المجلد: {appearance.volume}, </span>}
                          {appearance.page && <span>الصفحة: {appearance.page}</span>}
                        </>
                      }
                    />
                  </ReferenceItem>
                ))}
              </List>
              
              {conceptResults.relatedConcepts?.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>مفاهيم ذات صلة:</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                    {conceptResults.relatedConcepts.map((concept: string, index: number) => (
                      <Chip 
                        key={index} 
                        label={concept} 
                        color="primary" 
                        size="medium" 
                        onClick={() => {
                          setConcept(concept);
                          handleConceptExplore();
                        }}
                        clickable
                      />
                    ))}
                  </Box>
                </Box>
              )}
            </ResultPaper>
          )}
        </TabPanel>
        
        {/* Browse Works Tab */}
        <TabPanel value={tabValue} index={3}>
          <Typography variant="h6" gutterBottom>
            تصفح مؤلفات المسيري
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            استعرض أهم أعمال الدكتور عبدالوهاب المسيري ومساهماته الفكرية
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Paper elevation={1} sx={{ p: 2, height: '100%' }}>
                <Typography variant="subtitle1" gutterBottom>
                  أعمال المسيري الرئيسية
                </Typography>
                <List sx={{ maxHeight: '400px', overflowY: 'auto' }}>
                  <ListItem button selected={selectedWork === 'encyclopedia'} onClick={() => handleWorkSelect('encyclopedia')}>
                    <ListItemText primary="موسوعة اليهود واليهودية والصهيونية" />
                  </ListItem>
                  <ListItem button selected={selectedWork === 'terminology'} onClick={() => handleWorkSelect('terminology')}>
                    <ListItemText primary="الموسوعة الفلسفية النقدية" />
                  </ListItem>
                  <ListItem button selected={selectedWork === 'secularism'} onClick={() => handleWorkSelect('secularism')}>
                    <ListItemText primary="العلمانية الجزئية والعلمانية الشاملة" />
                  </ListItem>
                  <ListItem button selected={selectedWork === 'postmodernism'} onClick={() => handleWorkSelect('postmodernism')}>
                    <ListItemText primary="رحلتي الفكرية في البذور والجذور والثمر" />
                  </ListItem>
                  <ListItem button selected={selectedWork === 'humanism'} onClick={() => handleWorkSelect('humanism')}>
                    <ListItemText primary="الإنسان والحضارة" />
                  </ListItem>
                </List>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={8}>
              {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                  <CircularProgress />
                </Box>
              )}
              
              {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
              
              {workResults && (
                <Paper elevation={1} sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>{workResults.title}</Typography>
                  <Typography variant="body1" paragraph dir="rtl">
                    {workResults.description}
                  </Typography>
                  
                  {workResults.volumes && (
                    <Typography variant="body2" color="text.secondary">
                      عدد المجلدات: {workResults.volumes}
                    </Typography>
                  )}
                  
                  <Divider sx={{ my: 2 }} />
                  
                  {workResults.concepts?.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>أهم المفاهيم في هذا العمل:</Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                        {workResults.concepts.map((concept: string, index: number) => (
                          <Chip 
                            key={index} 
                            label={concept} 
                            color="primary" 
                            size="medium" 
                            onClick={() => {
                              setConcept(concept);
                              setTabValue(2);
                              setTimeout(() => handleConceptExplore(), 100);
                            }}
                            clickable
                          />
                        ))}
                      </Box>
                    </Box>
                  )}
                  
                  {workResults.excerpts?.length > 0 && (
                    <Box sx={{ mt: 3 }}>
                      <Typography variant="subtitle2" gutterBottom>مقتطفات مختارة:</Typography>
                      <List>
                        {workResults.excerpts.map((excerpt: any, index: number) => (
                          <ReferenceItem key={index}>
                            <ListItemText
                              primary={
                                <Typography variant="body2" color="text.primary" dir="rtl">
                                  {excerpt.text}
                                </Typography>
                              }
                              secondary={
                                <>
                                  {excerpt.volume && <span>المجلد: {excerpt.volume}, </span>}
                                  {excerpt.page && <span>الصفحة: {excerpt.page}</span>}
                                </>
                              }
                            />
                          </ReferenceItem>
                        ))}
                      </List>
                    </Box>
                  )}
                </Paper>
              )}
            </Grid>
          </Grid>
        </TabPanel>
      </StyledPaper>
      
      <Box sx={{ mt: 4, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
        <Typography variant="subtitle2" color="text.secondary" align="center">
          هذه الخدمة قائمة على نموذج لغوي تم تدريبه على أعمال الدكتور عبدالوهاب المسيري.
          الإجابات قد لا تعكس بدقة تامة آراء الدكتور المسيري وينصح بالرجوع إلى أعماله الأصلية للتأكد.
        </Typography>
      </Box>
    </Container>
  );
};

export default MessiriLLM;
