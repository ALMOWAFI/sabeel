import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Tabs, Tab, Grid, Divider, Button, CircularProgress, Alert } from '@mui/material';
import { styled } from '@mui/material/styles';
import EnhancedKnowledgeGraph from './EnhancedKnowledgeGraph';
import offlineStorage, { ContentNamespace, IslamicContent } from '../../services/enhanced/OfflineStorageService';
import enhancedVerifier from '../../services/enhanced/EnhancedIslamicVerifier';
import { FarouqService, Scholar, KnowledgeDomain } from '../../services/FarouqService';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import VerifiedIcon from '@mui/icons-material/Verified';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import SchemaIcon from '@mui/icons-material/Schema';

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
}));

const FeatureCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[8],
  },
}));

const TabPanel = (props: { children: React.ReactNode; value: number; index: number }) => {
  const { children, value, index } = props;
  return (
    <div role="tabpanel" hidden={value !== index} id={`tabpanel-${index}`}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const IntegratedIslamicKnowledgeSystem: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [offlineStats, setOfflineStats] = useState<{ totalItems: number; lastUpdated: string | null }>({ 
    totalItems: 0, 
    lastUpdated: null 
  });
  const [loadingStats, setLoadingStats] = useState(true);
  const [selectedConcept, setSelectedConcept] = useState<string | undefined>(undefined);
  const [verificationStatus, setVerificationStatus] = useState<{
    loading: boolean;
    result: any | null;
    error: string | null;
  }>({
    loading: false,
    result: null,
    error: null
  });

  // Sample concepts for presentation
  const featuredConcepts = [
    {
      id: 'comprehensive-secularism',
      title: 'العلمانية الشاملة',
      description: 'النموذج المعرفي الذي يرفض المطلقات والثوابت',
      domain: KnowledgeDomain.SECULARISM
    },
    {
      id: 'knowledge-paradigm',
      title: 'النموذج المعرفي',
      description: 'الصورة المجردة التي تنظم رؤيتنا للعالم وتفسره',
      domain: KnowledgeDomain.PHILOSOPHY
    },
    {
      id: 'functional-groups',
      title: 'الجماعات الوظيفية',
      description: 'جماعات تضطلع بوظائف محددة داخل المجتمعات',
      domain: KnowledgeDomain.ZIONISM
    }
  ];

  // Sample content for verification demonstration
  const sampleContent = [
    {
      id: 'content-1',
      title: 'العلمانية الشاملة في الغرب',
      content: 'العلمانية الشاملة هي نموذج معرفي يرفض كل المطلقات والثوابت، ويؤدي إلى تفكك القيم والمعايير وتسييل الواقع. وقد أدى تطبيقها في المجتمعات الغربية إلى أزمة معنى وأزمة قيم.'
    },
    {
      id: 'content-2',
      title: 'التحيز المعرفي الغربي',
      content: 'يرى د. عبد الوهاب المسيري أن النموذج المعرفي الغربي يتسم بالتحيز لمركزية الإنسان الغربي، ويشكل قيمة مطلقة يستبعد من خلالها النماذج المعرفية الأخرى.'
    },
    {
      id: 'content-3',
      title: 'الصهيونية والجماعات الوظيفية',
      content: 'طور المسيري مفهوم الجماعات الوظيفية ليفسر دور اليهود في أوروبا كجماعة وظيفية، ثم تحول هذا الدور مع ظهور الفكر الصهيوني والدولة الوظيفية الصهيونية.'
    }
  ];

  useEffect(() => {
    // Load offline storage statistics
    const loadStats = async () => {
      try {
        const stats = await offlineStorage.getStorageStats();
        setOfflineStats({
          totalItems: stats.totalItems,
          lastUpdated: stats.totalItems > 0 
            ? new Date(Math.max(...Object.values(stats.namespaceStats).map(s => s.lastUpdated))).toLocaleDateString() 
            : null
        });
      } catch (error) {
        console.error('Error loading offline stats:', error);
      } finally {
        setLoadingStats(false);
      }
    };

    loadStats();
  }, []);

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setSelectedTab(newValue);
  };

  const handleConceptSelect = (conceptId: string) => {
    setSelectedConcept(conceptId);
  };

  const handleSaveContent = async (content: any) => {
    try {
      const islamicContent: IslamicContent = {
        id: content.id,
        title: content.title,
        content: content.content,
        dateAdded: Date.now(),
        language: 'ar',
        type: 'concept',
        tags: ['messiri', 'concept'],
        source: 'Dr. Abdul Wahab Al-Messiri',
      };
      
      await offlineStorage.storeIslamicContent(ContentNamespace.MESSIRI_CONCEPTS, islamicContent);
      
      // Refresh stats
      const stats = await offlineStorage.getStorageStats();
      setOfflineStats({
        totalItems: stats.totalItems,
        lastUpdated: new Date().toLocaleDateString()
      });
      
      return true;
    } catch (error) {
      console.error('Error saving content:', error);
      return false;
    }
  };

  const handleVerifyContent = async (contentId: string) => {
    try {
      setVerificationStatus({
        loading: true,
        result: null,
        error: null
      });
      
      const contentToVerify = sampleContent.find(c => c.id === contentId);
      if (!contentToVerify) {
        throw new Error('Content not found');
      }
      
      // Use the enhanced verifier
      const result = await enhancedVerifier.verifyContent(contentToVerify.content);
      
      setVerificationStatus({
        loading: false,
        result,
        error: null
      });
    } catch (error) {
      setVerificationStatus({
        loading: false,
        result: null,
        error: 'Error verifying content: ' + (error instanceof Error ? error.message : 'Unknown error')
      });
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', mt: 4, px: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center" fontWeight="bold">
        النظام المتكامل للمعرفة الإسلامية
      </Typography>
      
      <Typography variant="subtitle1" gutterBottom align="center" color="text.secondary" sx={{ mb: 4 }}>
        دمج تقنيات الذكاء الاصطناعي مع التراث العلمي الإسلامي
      </Typography>
      
      <Tabs 
        value={selectedTab} 
        onChange={handleTabChange} 
        centered 
        sx={{ mb: 2 }}
        textColor="primary"
        indicatorColor="primary"
      >
        <Tab label="نظرة عامة" icon={<MenuBookIcon />} iconPosition="start" />
        <Tab label="شبكة المفاهيم" icon={<SchemaIcon />} iconPosition="start" />
        <Tab label="المحتوى غير المتصل" icon={<SaveAltIcon />} iconPosition="start" />
        <Tab label="التحقق من المحتوى" icon={<VerifiedIcon />} iconPosition="start" />
      </Tabs>
      
      <TabPanel value={selectedTab} index={0}>
        <StyledPaper elevation={3}>
          <Typography variant="h5" gutterBottom>
            نظام معرفي متكامل
          </Typography>
          <Typography variant="body1" paragraph>
            يجمع هذا النظام بين تقنيات الذكاء الاصطناعي الحديثة وتراث العلماء المسلمين، مع التركيز على أعمال د. عبد الوهاب المسيري. يهدف النظام إلى توفير أدوات تفاعلية لاستكشاف وتحليل المفاهيم الإسلامية والفكرية المعاصرة.
          </Typography>
          
          <Divider sx={{ my: 3 }} />
          
          <Typography variant="h6" gutterBottom>
            المميزات الرئيسية
          </Typography>
          
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12} md={4}>
              <FeatureCard elevation={2}>
                <Box display="flex" alignItems="center" mb={2}>
                  <SchemaIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">شبكة المفاهيم التفاعلية</Typography>
                </Box>
                <Typography variant="body2" sx={{ flex: 1 }}>
                  استكشاف العلاقات بين المفاهيم المختلفة في فكر د. عبد الوهاب المسيري من خلال رسم بياني تفاعلي، مع إمكانية البحث والتنقل بين المفاهيم.
                </Typography>
                <Button 
                  variant="outlined" 
                  color="primary" 
                  sx={{ mt: 2, alignSelf: 'flex-start' }}
                  onClick={() => setSelectedTab(1)}
                >
                  استكشاف الشبكة
                </Button>
              </FeatureCard>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <FeatureCard elevation={2}>
                <Box display="flex" alignItems="center" mb={2}>
                  <SaveAltIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">تخزين غير متصل بالإنترنت</Typography>
                </Box>
                <Typography variant="body2" sx={{ flex: 1 }}>
                  حفظ المحتوى الإسلامي للاستخدام دون اتصال بالإنترنت، مما يتيح الوصول إلى المعرفة الإسلامية في أي وقت ومكان، مع تنظيمها في فئات مختلفة.
                </Typography>
                <Button 
                  variant="outlined" 
                  color="primary" 
                  sx={{ mt: 2, alignSelf: 'flex-start' }}
                  onClick={() => setSelectedTab(2)}
                >
                  إدارة المحتوى
                </Button>
              </FeatureCard>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <FeatureCard elevation={2}>
                <Box display="flex" alignItems="center" mb={2}>
                  <VerifiedIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">التحقق من المحتوى</Typography>
                </Box>
                <Typography variant="body2" sx={{ flex: 1 }}>
                  التحقق من صحة المحتوى الإسلامي باستخدام تقنيات الذكاء الاصطناعي المتقدمة، مع مراعاة المبادئ والمعايير الإسلامية والاستناد إلى المصادر الموثوقة.
                </Typography>
                <Button 
                  variant="outlined" 
                  color="primary" 
                  sx={{ mt: 2, alignSelf: 'flex-start' }}
                  onClick={() => setSelectedTab(3)}
                >
                  تجربة التحقق
                </Button>
              </FeatureCard>
            </Grid>
          </Grid>
        </StyledPaper>
        
        <StyledPaper elevation={3} sx={{ mt: 3 }}>
          <Typography variant="h5" gutterBottom>
            المفاهيم المميزة للدكتور المسيري
          </Typography>
          
          <Grid container spacing={3} sx={{ mt: 2 }}>
            {featuredConcepts.map((concept) => (
              <Grid item xs={12} sm={4} key={concept.id}>
                <FeatureCard elevation={2}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                    {concept.title}
                  </Typography>
                  <Typography variant="body2" paragraph>
                    {concept.description}
                  </Typography>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    size="small"
                    onClick={() => {
                      setSelectedTab(1);
                      handleConceptSelect(concept.id);
                    }}
                    sx={{ mt: 'auto', alignSelf: 'flex-start' }}
                  >
                    استكشاف
                  </Button>
                </FeatureCard>
              </Grid>
            ))}
          </Grid>
        </StyledPaper>
      </TabPanel>
      
      <TabPanel value={selectedTab} index={1}>
        <StyledPaper elevation={3}>
          <EnhancedKnowledgeGraph initialConcept={selectedConcept} />
        </StyledPaper>
      </TabPanel>
      
      <TabPanel value={selectedTab} index={2}>
        <StyledPaper elevation={3}>
          <Typography variant="h5" gutterBottom>
            المحتوى المتاح دون اتصال بالإنترنت
          </Typography>
          
          <Box sx={{ mb: 4, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
            <Typography variant="subtitle1" gutterBottom>
              إحصائيات التخزين:
            </Typography>
            
            {loadingStats ? (
              <CircularProgress size={24} />
            ) : (
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1">
                    <strong>عدد العناصر المخزنة:</strong> {offlineStats.totalItems}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1">
                    <strong>آخر تحديث:</strong> {offlineStats.lastUpdated || 'لا يوجد محتوى مخزن بعد'}
                  </Typography>
                </Grid>
              </Grid>
            )}
          </Box>
          
          <Typography variant="h6" gutterBottom>
            حفظ مفاهيم المسيري للاستخدام دون اتصال
          </Typography>
          
          <Grid container spacing={3} sx={{ mt: 2 }}>
            {sampleContent.map((content) => (
              <Grid item xs={12} sm={4} key={content.id}>
                <FeatureCard elevation={2}>
                  <Typography variant="h6" gutterBottom>
                    {content.title}
                  </Typography>
                  <Typography variant="body2" paragraph sx={{ maxHeight: 100, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {content.content}
                  </Typography>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    size="small"
                    onClick={async () => {
                      const success = await handleSaveContent(content);
                      if (success) {
                        alert('تم حفظ المحتوى بنجاح للاستخدام دون اتصال');
                      }
                    }}
                    startIcon={<SaveAltIcon />}
                    sx={{ mt: 'auto', alignSelf: 'flex-start' }}
                  >
                    حفظ للاستخدام دون اتصال
                  </Button>
                </FeatureCard>
              </Grid>
            ))}
          </Grid>
        </StyledPaper>
      </TabPanel>
      
      <TabPanel value={selectedTab} index={3}>
        <StyledPaper elevation={3}>
          <Typography variant="h5" gutterBottom>
            التحقق من المحتوى الإسلامي
          </Typography>
          
          <Typography variant="body1" paragraph>
            يمكنك استخدام هذه الأداة للتحقق من مدى توافق المحتوى مع المبادئ والمعايير الإسلامية، بالاستناد إلى المصادر الموثوقة وأقوال العلماء.
          </Typography>
          
          <Divider sx={{ my: 3 }} />
          
          <Typography variant="h6" gutterBottom>
            عينات للتحقق:
          </Typography>
          
          <Grid container spacing={3} sx={{ mt: 2 }}>
            {sampleContent.map((content) => (
              <Grid item xs={12} md={4} key={content.id}>
                <FeatureCard elevation={2}>
                  <Typography variant="h6" gutterBottom>
                    {content.title}
                  </Typography>
                  <Typography variant="body2" paragraph sx={{ maxHeight: 100, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {content.content}
                  </Typography>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    size="small"
                    onClick={() => handleVerifyContent(content.id)}
                    startIcon={<VerifiedIcon />}
                    sx={{ mt: 'auto', alignSelf: 'flex-start' }}
                  >
                    تحقق من المحتوى
                  </Button>
                </FeatureCard>
              </Grid>
            ))}
          </Grid>
          
          {verificationStatus.loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <CircularProgress />
            </Box>
          )}
          
          {verificationStatus.error && (
            <Alert severity="error" sx={{ mt: 4 }}>
              {verificationStatus.error}
            </Alert>
          )}
          
          {verificationStatus.result && (
            <Box sx={{ mt: 4 }}>
              <Alert 
                severity={verificationStatus.result.isValid ? "success" : "warning"}
                sx={{ mb: 2 }}
              >
                {verificationStatus.result.isValid ? 
                  "المحتوى متوافق مع المبادئ الإسلامية" : 
                  "المحتوى يحتاج إلى مراجعة"}
              </Alert>
              
              <Paper sx={{ p: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>مستوى الثقة:</strong> {Math.round(verificationStatus.result.confidence * 100)}%
                </Typography>
                
                {verificationStatus.result.concerns.length > 0 && (
                  <>
                    <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                      <strong>الملاحظات:</strong>
                    </Typography>
                    <ul>
                      {verificationStatus.result.concerns.map((concern: string, index: number) => (
                        <li key={index}>
                          <Typography variant="body2">{concern}</Typography>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
                
                {verificationStatus.result.suggestions.length > 0 && (
                  <>
                    <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                      <strong>الاقتراحات:</strong>
                    </Typography>
                    <ul>
                      {verificationStatus.result.suggestions.map((suggestion: string, index: number) => (
                        <li key={index}>
                          <Typography variant="body2">{suggestion}</Typography>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
                
                {verificationStatus.result.scholarReferences.length > 0 && (
                  <>
                    <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                      <strong>المراجع العلمية:</strong>
                    </Typography>
                    <ul>
                      {verificationStatus.result.scholarReferences.map((ref: any, index: number) => (
                        <li key={index}>
                          <Typography variant="body2">
                            <strong>{ref.scholar}:</strong> {ref.work} - {ref.excerpt}
                          </Typography>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </Paper>
            </Box>
          )}
        </StyledPaper>
      </TabPanel>
    </Box>
  );
};

export default IntegratedIslamicKnowledgeSystem;
