import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, Paper, TextField, Button, Chip, CircularProgress } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { styled } from '@mui/material/styles';

// Mock imports for compatibility
const Network = function() { this.on = () => {}; this.destroy = () => {}; this.focus = () => {}; this.selectNodes = () => {}; };
const DataSet = function() { this.add = () => {}; };

// Styled components
const GraphContainer = styled(Box)(({ theme }) => ({
  height: '600px',
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  marginTop: theme.spacing(2),
  position: 'relative',
}));

const ControlsPanel = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

const LegendItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginRight: theme.spacing(2),
}));

const ColorBox = styled(Box)(({ theme, color }: { theme: any; color: string }) => ({
  width: 16,
  height: 16,
  backgroundColor: color,
  marginRight: theme.spacing(1),
  borderRadius: 2,
}));

interface MessiriConcept {
  id: string;
  label: string;
  domain: string;
  description: string;
  relatedConcepts: string[];
}

// Sample data based on Al-Messiri's concepts
const messiriConcepts: MessiriConcept[] = [
  {
    id: 'comprehensive-secularism',
    label: 'العلمانية الشاملة',
    domain: 'philosophy',
    description: 'نموذج معرفي يرفض كل المطلقات والثوابت ويؤدي إلى سيولة وتفكك القيم والمعايير',
    relatedConcepts: ['partial-secularism', 'immanence', 'knowledge-paradigm']
  },
  {
    id: 'partial-secularism',
    label: 'العلمانية الجزئية',
    domain: 'philosophy',
    description: 'فصل الدين عن الدولة مع الاحتفاظ بمنظومة القيم الإنسانية',
    relatedConcepts: ['comprehensive-secularism', 'knowledge-paradigm']
  },
  {
    id: 'immanence',
    label: 'الحلولية',
    domain: 'philosophy',
    description: 'رؤية للكون تذهب إلى أن الإله حال في الطبيعة وليس متجاوزاً لها',
    relatedConcepts: ['comprehensive-secularism', 'materialism']
  },
  {
    id: 'knowledge-paradigm',
    label: 'النموذج المعرفي',
    domain: 'philosophy',
    description: 'صورة عقلية مجردة تنظم الواقع وتفسره، تحدد الأسئلة المطروحة والإجابات الممكنة',
    relatedConcepts: ['comprehensive-secularism', 'partial-secularism', 'objectivity']
  },
  {
    id: 'received-objectivity',
    label: 'الموضوعية المتلقية',
    domain: 'philosophy',
    description: 'الموضوعية التي تدعي الحياد التام والانفصال عن الذات البشرية',
    relatedConcepts: ['interpretive-objectivity', 'knowledge-paradigm']
  },
  {
    id: 'interpretive-objectivity',
    label: 'الموضوعية الاجتهادية',
    domain: 'philosophy',
    description: 'الموضوعية التي تعترف بدور الذات البشرية في عملية المعرفة',
    relatedConcepts: ['received-objectivity', 'knowledge-paradigm']
  },
  {
    id: 'zionist-settlement',
    label: 'الصهيونية الاستيطانية',
    domain: 'zionism',
    description: 'الفكر الصهيوني الذي يدعو لإقامة وطن قومي لليهود في فلسطين',
    relatedConcepts: ['localization-zionism', 'functional-groups']
  },
  {
    id: 'localization-zionism',
    label: 'الصهيونية التوطينية',
    domain: 'zionism',
    description: 'تيار صهيوني يهدف إلى إيجاد أي وطن قومي لليهود وليس بالضرورة في فلسطين',
    relatedConcepts: ['zionist-settlement', 'diaspora-jews']
  },
  {
    id: 'functional-groups',
    label: 'الجماعات الوظيفية',
    domain: 'zionism',
    description: 'جماعات بشرية تضطلع بوظائف محددة داخل المجتمعات التي تعيش فيها',
    relatedConcepts: ['zionist-settlement', 'diaspora-jews', 'functional-state']
  },
  {
    id: 'diaspora-jews',
    label: 'يهود المنفى',
    domain: 'zionism',
    description: 'اليهود الذين يعيشون خارج فلسطين وفق المفهوم الصهيوني',
    relatedConcepts: ['localization-zionism', 'functional-groups']
  },
  {
    id: 'functional-state',
    label: 'الدولة الوظيفية',
    domain: 'zionism',
    description: 'دولة تؤسس لتؤدي وظيفة محددة لخدمة مصالح القوى الاستعمارية',
    relatedConcepts: ['functional-groups', 'zionist-settlement']
  },
  {
    id: 'human-centered',
    label: 'الإنسانية المتمركزة حول الإنسان',
    domain: 'humanism',
    description: 'الإنسانية التي تجعل الإنسان مركز الكون ومصدر القيم',
    relatedConcepts: ['transcendent-humanism', 'immanence']
  },
  {
    id: 'transcendent-humanism',
    label: 'الإنسانية المتجاوزة للإنسان',
    domain: 'humanism',
    description: 'الإنسانية التي تؤمن بوجود مرجعية متجاوزة للإنسان',
    relatedConcepts: ['human-centered', 'rabbani-human']
  },
  {
    id: 'rabbani-human',
    label: 'الإنسان الرباني',
    domain: 'humanism',
    description: 'الإنسان الذي يستمد قيمه ومعاييره من الله',
    relatedConcepts: ['transcendent-humanism', 'knowledge-paradigm']
  }
];

interface EnhancedKnowledgeGraphProps {
  initialConcept?: string;
}

const EnhancedKnowledgeGraph: React.FC<EnhancedKnowledgeGraphProps> = ({ initialConcept }) => {
  const networkRef = useRef<HTMLDivElement>(null);
  const [network, setNetwork] = useState<Network | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNode, setSelectedNode] = useState<MessiriConcept | null>(null);
  const [loading, setLoading] = useState(false);

  // Define colors for different domains
  const domainColors = {
    philosophy: '#1976d2',
    zionism: '#d32f2f',
    humanism: '#388e3c'
  };

  useEffect(() => {
    if (networkRef.current) {
      setLoading(true);
      
      // Create nodes dataset
      const nodes = new DataSet(
        messiriConcepts.map(concept => ({
          id: concept.id,
          label: concept.label,
          title: concept.description,
          group: concept.domain,
          font: { 
            face: 'Amiri, Arial',
            size: 16
          }
        }))
      );

      // Create edges dataset
      const edges = new DataSet();
      messiriConcepts.forEach(concept => {
        concept.relatedConcepts.forEach(relatedId => {
          edges.add({
            from: concept.id,
            to: relatedId,
            arrows: {
              to: {
                enabled: false
              }
            },
            color: {
              color: '#9e9e9e',
              highlight: '#2196f3'
            },
            smooth: {
              type: 'continuous'
            }
          });
        });
      });

      // Network configuration
      const options = {
        nodes: {
          shape: 'dot',
          size: 20,
          borderWidth: 2,
          shadow: true,
          color: {
            border: '#ffffff',
            background: '#666666',
            highlight: {
              border: '#ffffff',
              background: '#000000'
            }
          },
          font: {
            color: '#000000',
            size: 18,
            face: 'Amiri, Arial',
            align: 'center'
          }
        },
        edges: {
          width: 2,
          shadow: true,
          smooth: {
            type: 'continuous'
          }
        },
        physics: {
          stabilization: {
            iterations: 200,
            fit: true
          },
          barnesHut: {
            gravitationalConstant: -2000,
            centralGravity: 0.1,
            springLength: 150,
            springConstant: 0.05,
            damping: 0.09
          }
        },
        groups: {
          philosophy: {
            color: domainColors.philosophy
          },
          zionism: {
            color: domainColors.zionism
          },
          humanism: {
            color: domainColors.humanism
          }
        },
        interaction: {
          hover: true,
          navigationButtons: true,
          keyboard: true
        },
        layout: {
          randomSeed: 42,
          improvedLayout: true
        }
      };

      // Create network
      const newNetwork = new Network(networkRef.current, { nodes, edges }, options);
      
      // Focus on initial concept if provided
      if (initialConcept) {
        const found = messiriConcepts.find(c => c.id === initialConcept || c.label.includes(initialConcept));
        if (found) {
          newNetwork.focus(found.id, {
            scale: 1.2,
            animation: true
          });
          setSelectedNode(found);
        }
      }

      // Add event listeners
      newNetwork.on('click', function(properties) {
        if (properties.nodes.length > 0) {
          const nodeId = properties.nodes[0];
          const concept = messiriConcepts.find(c => c.id === nodeId);
          if (concept) {
            setSelectedNode(concept);
          }
        } else {
          setSelectedNode(null);
        }
      });

      newNetwork.on('stabilizationProgress', function(params) {
        // Loading progress
      });

      newNetwork.on('stabilizationIterationsDone', function() {
        setLoading(false);
      });

      setNetwork(newNetwork);

      return () => {
        newNetwork.destroy();
      };
    }
  }, [initialConcept]);

  const handleSearch = () => {
    if (!searchTerm.trim() || !network) return;
    
    const foundConcept = messiriConcepts.find(
      c => c.label.includes(searchTerm) || 
           c.description.includes(searchTerm) ||
           c.id.includes(searchTerm.toLowerCase())
    );
    
    if (foundConcept) {
      network.focus(foundConcept.id, {
        scale: 1.2,
        animation: true
      });
      network.selectNodes([foundConcept.id]);
      setSelectedNode(foundConcept);
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
        شبكة المفاهيم عند د. عبد الوهاب المسيري
      </Typography>
      
      <ControlsPanel elevation={2}>
        <Box display="flex" alignItems="center">
          <TextField
            fullWidth
            placeholder="ابحث عن مفهوم..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            InputProps={{
              endAdornment: (
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={handleSearch}
                  startIcon={<SearchIcon />}
                >
                  بحث
                </Button>
              )
            }}
            dir="rtl"
          />
        </Box>
        
        <Box display="flex" mt={2}>
          <LegendItem>
            <ColorBox color={domainColors.philosophy} />
            <Typography variant="body2">الفلسفة</Typography>
          </LegendItem>
          <LegendItem>
            <ColorBox color={domainColors.zionism} />
            <Typography variant="body2">الصهيونية</Typography>
          </LegendItem>
          <LegendItem>
            <ColorBox color={domainColors.humanism} />
            <Typography variant="body2">الإنسانية</Typography>
          </LegendItem>
        </Box>
      </ControlsPanel>
      
      <GraphContainer ref={networkRef}>
        {loading && (
          <Box 
            position="absolute" 
            top="50%" 
            left="50%" 
            sx={{ transform: 'translate(-50%, -50%)' }}
            display="flex"
            flexDirection="column"
            alignItems="center"
          >
            <CircularProgress />
            <Typography variant="body2" mt={2}>جاري تحميل شبكة المفاهيم...</Typography>
          </Box>
        )}
      </GraphContainer>
      
      {selectedNode && (
        <Paper elevation={3} sx={{ mt: 2, p: 2 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="h6">{selectedNode.label}</Typography>
            <Chip 
              label={
                selectedNode.domain === 'philosophy' ? 'الفلسفة' : 
                selectedNode.domain === 'zionism' ? 'الصهيونية' : 'الإنسانية'
              } 
              color={
                selectedNode.domain === 'philosophy' ? 'primary' : 
                selectedNode.domain === 'zionism' ? 'error' : 'success'
              }
            />
          </Box>
          <Typography variant="body1" paragraph dir="rtl">
            {selectedNode.description}
          </Typography>
          <Typography variant="subtitle2" gutterBottom>
            المفاهيم المرتبطة:
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={1}>
            {selectedNode.relatedConcepts.map(relatedId => {
              const relatedConcept = messiriConcepts.find(c => c.id === relatedId);
              return relatedConcept ? (
                <Chip 
                  key={relatedId}
                  label={relatedConcept.label}
                  variant="outlined"
                  onClick={() => {
                    if (network) {
                      network.focus(relatedId, {
                        scale: 1.2,
                        animation: true
                      });
                      network.selectNodes([relatedId]);
                      setSelectedNode(relatedConcept);
                    }
                  }}
                />
              ) : null;
            })}
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default EnhancedKnowledgeGraph;
