/**
 * TensorFlow.js Configuration for Sabeel Platform
 * 
 * This file contains all the necessary configuration for the TensorFlow.js integration
 * with the Sabeel Islamic Knowledge Platform.
 * 
 * TensorFlow.js is used for:
 * - Text analysis of Islamic texts
 * - Natural language processing for Arabic
 * - Content recommendation systems
 * - Pattern recognition in scholarly texts
 * - Knowledge graph enrichment
 */

const tensorflowConfig = {
  // Base configuration
  modelPath: process.env.TFJS_MODEL_PATH || '/assets/models',
  
  // Model configuration
  models: {
    arabicNLP: {
      name: 'arabic-nlp',
      version: '1.0.0',
      description: 'Arabic natural language processing model',
      path: '/arabic-nlp',
      inputShape: [1, 128],
      outputShape: [1, 768]
    },
    contentRecommender: {
      name: 'content-recommender',
      version: '1.0.0',
      description: 'Islamic content recommendation model',
      path: '/content-recommender',
      inputShape: [1, 50],
      outputShape: [1, 100]
    },
    quranAnalysis: {
      name: 'quran-analysis',
      version: '1.0.0',
      description: 'Quranic text analysis model',
      path: '/quran-analysis',
      inputShape: [1, 256],
      outputShape: [1, 128]
    },
    scholarlyTextClassifier: {
      name: 'scholarly-text-classifier',
      version: '1.0.0',
      description: 'Islamic scholarly text classification model',
      path: '/scholarly-text-classifier',
      inputShape: [1, 512],
      outputShape: [1, 32]
    },
    knowledgeGraphEnricher: {
      name: 'knowledge-graph-enricher',
      version: '1.0.0',
      description: 'Model for enriching Islamic knowledge graphs',
      path: '/knowledge-graph-enricher',
      inputShape: [1, 128],
      outputShape: [1, 128]
    }
  },
  
  // API endpoints for model training and inference
  endpoints: {
    training: process.env.TFJS_TRAINING_ENDPOINT || '/api/tfjs/training',
    inference: process.env.TFJS_INFERENCE_ENDPOINT || '/api/tfjs/inference',
    models: process.env.TFJS_MODELS_ENDPOINT || '/api/tfjs/models'
  },
  
  // Default training parameters
  trainingDefaults: {
    batchSize: 32,
    epochs: 10,
    learningRate: 0.001,
    validationSplit: 0.2,
    shuffle: true,
    callbacks: {
      earlyStoppingPatience: 5,
      modelCheckpoint: true
    }
  },
  
  // Resources
  resources: {
    arabicWordEmbeddings: '/assets/resources/arabic-word-embeddings.json',
    islamicTerminology: '/assets/resources/islamic-terminology.json',
    quranCorpus: '/assets/resources/quran-corpus.json',
    hadithCorpus: '/assets/resources/hadith-corpus.json'
  },
  
  // Runtime options
  runtime: {
    useProfiling: process.env.TFJS_USE_PROFILING === 'true' || false,
    useGPU: process.env.TFJS_USE_GPU === 'true' || true,
    memoryManagement: {
      autoReleaseMemory: true,
      maxMemoryMB: 4096
    }
  }
};

module.exports = tensorflowConfig;
