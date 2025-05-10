/**
 * Sabeel Kingraph Integration
 * A knowledge graph visualization library customized for Islamic knowledge
 * 
 * This library extends Kingraph with features specifically designed for
 * Islamic knowledge visualization, including specialized node types for
 * scholars, concepts, books, hadiths, and Quranic verses.
 */

import * as d3 from 'd3';
import cytoscape from 'cytoscape';
import coseBilkent from 'cytoscape-cose-bilkent';
import popper from 'cytoscape-popper';
import tippy from 'tippy.js';

// Register cytoscape extensions
cytoscape.use(coseBilkent);
cytoscape.use(popper);

class SabeelKingraph {
  /**
   * Constructor for SabeelKingraph
   * @param {Object} config - Configuration options
   */
  constructor(config = {}) {
    this.config = Object.assign({
      container: null,
      theme: 'light',
      language: 'ar',
      direction: 'rtl',
      nodeTypes: {
        scholar: { color: '#10B981', shape: 'ellipse' },
        concept: { color: '#6366F1', shape: 'diamond' },
        book: { color: '#0F172A', shape: 'rectangle' },
        hadith: { color: '#8B5CF6', shape: 'round-rectangle' },
        verse: { color: '#FBBF24', shape: 'star' },
        school: { color: '#F43F5E', shape: 'hexagon' },
        event: { color: '#475569', shape: 'octagon' }
      },
      relationTypes: {
        taught: { color: '#84CC16', width: 2, style: 'solid' },
        authored: { color: '#3B82F6', width: 2, style: 'solid' },
        referenced: { color: '#A855F7', width: 1, style: 'dashed' },
        explained: { color: '#F59E0B', width: 2, style: 'solid' },
        criticized: { color: '#EF4444', width: 1, style: 'dotted' },
        influenced: { color: '#06B6D4', width: 1, style: 'solid' },
        narrated: { color: '#8B5CF6', width: 2, style: 'solid' },
        contemporaryOf: { color: '#64748B', width: 1, style: 'dashed' }
      },
      showLabels: true,
      fitView: true,
      animationDuration: 500,
      tooltips: true,
      exportOptions: {
        formats: ['png', 'jpg', 'svg', 'json'],
        resolution: 2
      },
      layoutOptions: {
        name: 'cose-bilkent',
        padding: 50,
        animate: true,
        animationDuration: 500,
        nodeDimensionsIncludeLabels: true,
        randomize: true,
        nodeRepulsion: 8000,
        idealEdgeLength: 150,
        edgeElasticity: 0.45,
        nestingFactor: 0.1,
        gravity: 0.25,
        gravityRangeCompound: 1.5,
        gravityCompound: 1.0,
        gravityRange: 3.8,
        tilingPaddingVertical: 10,
        tilingPaddingHorizontal: 10,
        initialEnergyOnIncremental: 0.5
      }
    }, config);

    // Initialize core properties
    this.cy = null;
    this.data = { nodes: [], edges: [] };
    this.selectedNodes = [];
    this.selectedEdges = [];
    this.history = [];
    this.historyIndex = -1;

    // Initialize the graph if container is provided
    if (this.config.container) {
      this.initialize();
    }
  }

  /**
   * Initialize the graph
   * @param {HTMLElement|string} container - DOM element or selector
   */
  initialize(container = null) {
    const target = container || this.config.container;
    
    if (!target) {
      console.error('No container specified for SabeelKingraph');
      return false;
    }

    // Get the DOM element if a selector was provided
    const domElement = typeof target === 'string' ? document.querySelector(target) : target;
    
    if (!domElement) {
      console.error(`Container ${target} not found`);
      return false;
    }

    // Initialize Cytoscape instance
    this.cy = cytoscape({
      container: domElement,
      elements: [],
      style: this.generateCytoscapeStyle(),
      layout: this.config.layoutOptions,
      wheelSensitivity: 0.3,
      minZoom: 0.2,
      maxZoom: 3
    });

    // Set graph direction based on language
    if (this.config.direction === 'rtl') {
      domElement.style.direction = 'rtl';
    }

    // Initialize event handlers
    this.initializeEventHandlers();

    // Apply theme
    this.applyTheme(this.config.theme);

    return true;
  }

  /**
   * Generate Cytoscape style based on configuration
   * @returns {Array} Cytoscape style array
   */
  generateCytoscapeStyle() {
    const { nodeTypes, relationTypes, showLabels } = this.config;
    const style = [];

    // Node base style
    style.push({
      selector: 'node',
      style: {
        'background-color': '#999',
        'label': showLabels ? 'data(label)' : '',
        'text-valign': 'center',
        'text-halign': 'center',
        'font-size': '14px',
        'font-family': 'Arial, sans-serif',
        'text-wrap': 'wrap',
        'text-max-width': '120px',
        'text-outline-width': 2,
        'text-outline-color': '#fff',
        'text-outline-opacity': 0.8,
        'min-zoomed-font-size': '10px',
        'width': 50,
        'height': 50
      }
    });

    // Edge base style
    style.push({
      selector: 'edge',
      style: {
        'width': 1,
        'line-color': '#ccc',
        'target-arrow-color': '#ccc',
        'target-arrow-shape': 'triangle',
        'curve-style': 'bezier',
        'arrow-scale': 1.2,
        'label': showLabels ? 'data(label)' : '',
        'font-size': '12px',
        'text-rotation': 'autorotate',
        'text-background-opacity': 0.7,
        'text-background-color': '#fff',
        'text-background-padding': '3px',
        'min-zoomed-font-size': '8px'
      }
    });

    // Selected elements style
    style.push({
      selector: ':selected',
      style: {
        'background-color': '#FFA500',
        'line-color': '#FFA500',
        'target-arrow-color': '#FFA500',
        'border-width': 3,
        'border-color': '#FFD700'
      }
    });

    // Add specific styles for each node type
    Object.entries(nodeTypes).forEach(([type, props]) => {
      style.push({
        selector: `node.${type}`,
        style: {
          'background-color': props.color,
          'shape': props.shape
        }
      });
    });

    // Add specific styles for each edge type
    Object.entries(relationTypes).forEach(([type, props]) => {
      style.push({
        selector: `edge.${type}`,
        style: {
          'line-color': props.color,
          'target-arrow-color': props.color,
          'width': props.width,
          'line-style': props.style
        }
      });
    });

    return style;
  }

  /**
   * Initialize event handlers for graph interactions
   */
  initializeEventHandlers() {
    if (!this.cy) return;

    // Node click event
    this.cy.on('tap', 'node', (e) => {
      const node = e.target;
      this.onNodeClick(node);
    });

    // Edge click event
    this.cy.on('tap', 'edge', (e) => {
      const edge = e.target;
      this.onEdgeClick(edge);
    });

    // Background click event
    this.cy.on('tap', (e) => {
      if (e.target === this.cy) {
        this.onBackgroundClick();
      }
    });

    // Setup tooltips if enabled
    if (this.config.tooltips) {
      this.setupTooltips();
    }
  }

  /**
   * Setup tooltips for nodes and edges
   */
  setupTooltips() {
    this.cy.nodes().forEach(node => {
      const ref = node.popperRef();
      const content = this.createTooltipContent(node);
      
      tippy(ref, {
        content,
        trigger: 'manual',
        placement: 'top',
        arrow: true,
        interactive: true,
        theme: this.config.theme === 'dark' ? 'material' : 'light'
      });
    });

    this.cy.on('mouseover', 'node', (e) => {
      const node = e.target;
      if (node._tippy) node._tippy.show();
    });

    this.cy.on('mouseout', 'node', (e) => {
      const node = e.target;
      if (node._tippy) node._tippy.hide();
    });
  }

  /**
   * Create tooltip content based on node data
   * @param {Object} node - Cytoscape node
   * @returns {HTMLElement} Tooltip content
   */
  createTooltipContent(node) {
    const div = document.createElement('div');
    div.className = 'sabeel-kingraph-tooltip';
    
    const data = node.data();
    const type = data.type || 'unknown';
    
    let content = `<h3>${data.label || 'Unnamed'}</h3>`;
    content += `<p class="tooltip-type">${this.capitalizeFirstLetter(type)}</p>`;
    
    // Add additional details based on node type
    switch (type) {
      case 'scholar':
        content += `<p><strong>Dates:</strong> ${data.birthYear || '?'} - ${data.deathYear || '?'}</p>`;
        content += `<p><strong>School:</strong> ${data.school || 'Unknown'}</p>`;
        break;
      case 'book':
        content += `<p><strong>Author:</strong> ${data.author || 'Unknown'}</p>`;
        content += `<p><strong>Year:</strong> ${data.year || 'Unknown'}</p>`;
        break;
      case 'hadith':
        content += `<p><strong>Narrator:</strong> ${data.narrator || 'Unknown'}</p>`;
        content += `<p><strong>Collection:</strong> ${data.collection || 'Unknown'}</p>`;
        break;
      case 'verse':
        content += `<p><strong>Surah:</strong> ${data.surah || 'Unknown'}</p>`;
        content += `<p><strong>Ayah:</strong> ${data.ayah || 'Unknown'}</p>`;
        break;
    }
    
    // Add description if available
    if (data.description) {
      content += `<p class="tooltip-description">${data.description}</p>`;
    }
    
    div.innerHTML = content;
    return div;
  }

  /**
   * Capitalize the first letter of a string
   * @param {string} str - Input string
   * @returns {string} String with first letter capitalized
   */
  capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /**
   * Handle node click event
   * @param {Object} node - Cytoscape node
   */
  onNodeClick(node) {
    // Implement node click behavior
    this.selectedNodes.push(node);
    this.highlightConnectedElements(node);
    
    // Trigger callback if provided
    if (typeof this.config.onNodeClick === 'function') {
      this.config.onNodeClick(node.data(), node);
    }
  }

  /**
   * Handle edge click event
   * @param {Object} edge - Cytoscape edge
   */
  onEdgeClick(edge) {
    // Implement edge click behavior
    this.selectedEdges.push(edge);
    
    // Trigger callback if provided
    if (typeof this.config.onEdgeClick === 'function') {
      this.config.onEdgeClick(edge.data(), edge);
    }
  }

  /**
   * Handle background click event
   */
  onBackgroundClick() {
    // Clear selection on background click
    this.clearHighlights();
    this.selectedNodes = [];
    this.selectedEdges = [];
    
    // Trigger callback if provided
    if (typeof this.config.onBackgroundClick === 'function') {
      this.config.onBackgroundClick();
    }
  }

  /**
   * Highlight elements connected to a node
   * @param {Object} node - Cytoscape node
   */
  highlightConnectedElements(node) {
    this.clearHighlights();
    
    // Add highlighting class to the selected node
    node.addClass('highlighted');
    
    // Highlight connected edges and nodes
    const connectedEdges = node.connectedEdges();
    connectedEdges.addClass('highlighted');
    
    const connectedNodes = connectedEdges.connectedNodes();
    connectedNodes.addClass('highlighted');
  }

  /**
   * Clear all highlights
   */
  clearHighlights() {
    this.cy.elements().removeClass('highlighted');
  }

  /**
   * Load data into the graph
   * @param {Object} data - Graph data containing nodes and edges
   */
  loadData(data) {
    if (!this.cy) {
      console.error('Graph not initialized. Call initialize() first.');
      return false;
    }
    
    // Store data reference
    this.data = data;
    
    // Clear current graph
    this.cy.elements().remove();
    
    // Add nodes
    const nodes = (data.nodes || []).map(node => ({
      data: {
        id: node.id,
        label: node.label || node.id,
        type: node.type || 'concept',
        ...node
      },
      classes: node.type || 'concept'
    }));
    
    // Add edges
    const edges = (data.edges || []).map(edge => ({
      data: {
        id: edge.id || `${edge.source}-${edge.target}`,
        source: edge.source,
        target: edge.target,
        label: edge.label || '',
        type: edge.type || 'related',
        ...edge
      },
      classes: edge.type || 'related'
    }));
    
    // Add elements to graph
    this.cy.add([...nodes, ...edges]);
    
    // Apply layout
    this.applyLayout();
    
    // Setup tooltips if enabled
    if (this.config.tooltips) {
      this.setupTooltips();
    }
    
    // Save to history
    this.addToHistory();
    
    return true;
  }

  /**
   * Apply the configured layout
   * @param {Object} options - Override layout options
   */
  applyLayout(options = {}) {
    const layoutOptions = { ...this.config.layoutOptions, ...options };
    const layout = this.cy.layout(layoutOptions);
    
    layout.run();
    
    if (this.config.fitView) {
      this.cy.fit();
    }
  }

  /**
   * Apply theme to graph
   * @param {string} theme - Theme name ('light' or 'dark')
   */
  applyTheme(theme) {
    this.config.theme = theme;
    
    const container = this.cy.container();
    if (!container) return;
    
    if (theme === 'dark') {
      container.style.backgroundColor = '#1E293B';
      
      // Update style for dark theme
      this.cy.style().selector('node').style({
        'text-outline-color': '#1E293B',
        'color': '#ffffff'
      }).update();
      
      this.cy.style().selector('edge').style({
        'text-background-color': '#334155'
      }).update();
    } else {
      container.style.backgroundColor = '#ffffff';
      
      // Update style for light theme
      this.cy.style().selector('node').style({
        'text-outline-color': '#ffffff',
        'color': '#000000'
      }).update();
      
      this.cy.style().selector('edge').style({
        'text-background-color': '#f8fafc'
      }).update();
    }
  }

  /**
   * Add current graph state to history
   */
  addToHistory() {
    // Remove any forward history if we're in the middle of history
    if (this.historyIndex < this.history.length - 1) {
      this.history = this.history.slice(0, this.historyIndex + 1);
    }
    
    // Add current state to history
    this.history.push(JSON.parse(JSON.stringify(this.data)));
    this.historyIndex = this.history.length - 1;
    
    // Limit history size
    if (this.history.length > 50) {
      this.history.shift();
      this.historyIndex--;
    }
  }

  /**
   * Undo the last action
   */
  undo() {
    if (this.historyIndex <= 0) return false;
    
    this.historyIndex--;
    this.loadData(this.history[this.historyIndex]);
    return true;
  }

  /**
   * Redo the previously undone action
   */
  redo() {
    if (this.historyIndex >= this.history.length - 1) return false;
    
    this.historyIndex++;
    this.loadData(this.history[this.historyIndex]);
    return true;
  }

  /**
   * Search for nodes by criteria
   * @param {Object} criteria - Search criteria
   * @returns {Array} Matching nodes
   */
  search(criteria) {
    if (!this.cy) return [];
    
    let query = this.cy.nodes();
    
    if (criteria.type) {
      query = query.filter(`.${criteria.type}`);
    }
    
    if (criteria.text) {
      const searchText = criteria.text.toLowerCase();
      query = query.filter(node => {
        const data = node.data();
        return (data.label && data.label.toLowerCase().includes(searchText)) ||
               (data.description && data.description.toLowerCase().includes(searchText));
      });
    }
    
    return query;
  }

  /**
   * Find shortest path between two nodes
   * @param {string} sourceId - Source node ID
   * @param {string} targetId - Target node ID
   * @returns {Object} Path information
   */
  findShortestPath(sourceId, targetId) {
    if (!this.cy) return null;
    
    const sourceNode = this.cy.getElementById(sourceId);
    const targetNode = this.cy.getElementById(targetId);
    
    if (!sourceNode.length || !targetNode.length) {
      return null;
    }
    
    const dijkstra = this.cy.elements().dijkstra({
      root: sourceNode,
      directed: true
    });
    
    const path = dijkstra.pathTo(targetNode);
    const distance = dijkstra.distanceTo(targetNode);
    
    return {
      path,
      distance,
      sourceNode,
      targetNode
    };
  }

  /**
   * Highlight a path in the graph
   * @param {Array} path - Array of nodes and edges to highlight
   */
  highlightPath(path) {
    this.clearHighlights();
    
    if (!path || !path.length) return;
    
    path.forEach(element => {
      element.addClass('highlighted');
    });
  }

  /**
   * Export graph as image or data
   * @param {string} format - Export format (png, jpg, svg, json)
   * @returns {string|Object} Exported data
   */
  export(format) {
    if (!this.cy) return null;
    
    switch (format) {
      case 'png':
        return this.cy.png({
          output: 'blob',
          scale: this.config.exportOptions.resolution,
          bg: this.config.theme === 'dark' ? '#1E293B' : '#ffffff'
        });
      case 'jpg':
        return this.cy.jpg({
          output: 'blob',
          scale: this.config.exportOptions.resolution,
          bg: this.config.theme === 'dark' ? '#1E293B' : '#ffffff'
        });
      case 'svg':
        return this.cy.svg({
          scale: 1,
          full: true,
          bg: this.config.theme === 'dark' ? '#1E293B' : '#ffffff'
        });
      case 'json':
        return {
          nodes: this.cy.nodes().map(node => node.data()),
          edges: this.cy.edges().map(edge => edge.data())
        };
      default:
        return null;
    }
  }

  /**
   * Download graph as file
   * @param {string} format - Export format
   * @param {string} filename - Output filename
   */
  download(format, filename = 'sabeel-kingraph') {
    const data = this.export(format);
    
    if (!data) {
      console.error(`Unsupported export format: ${format}`);
      return;
    }
    
    if (format === 'json') {
      const jsonString = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      this.downloadFromUrl(url, `${filename}.json`);
    } else {
      // For image formats
      const url = URL.createObjectURL(data);
      this.downloadFromUrl(url, `${filename}.${format}`);
    }
  }

  /**
   * Helper method to trigger a file download
   * @param {string} url - Data URL
   * @param {string} filename - Output filename
   */
  downloadFromUrl(url, filename) {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Add a new node to the graph
   * @param {Object} nodeData - Node data
   * @returns {Object} Created node
   */
  addNode(nodeData) {
    if (!this.cy) return null;
    
    const nodeId = nodeData.id || `node-${Date.now()}`;
    
    const node = this.cy.add({
      group: 'nodes',
      data: {
        id: nodeId,
        label: nodeData.label || nodeId,
        type: nodeData.type || 'concept',
        ...nodeData
      },
      classes: nodeData.type || 'concept'
    });
    
    // Update data model
    if (!this.data.nodes) this.data.nodes = [];
    this.data.nodes.push(node.data());
    
    // Add to history
    this.addToHistory();
    
    return node;
  }

  /**
   * Add a new edge to the graph
   * @param {Object} edgeData - Edge data
   * @returns {Object} Created edge
   */
  addEdge(edgeData) {
    if (!this.cy) return null;
    
    // Ensure source and target nodes exist
    if (!edgeData.source || !edgeData.target) {
      console.error('Edge must have source and target properties');
      return null;
    }
    
    const edgeId = edgeData.id || `${edgeData.source}-${edgeData.target}-${Date.now()}`;
    
    const edge = this.cy.add({
      group: 'edges',
      data: {
        id: edgeId,
        source: edgeData.source,
        target: edgeData.target,
        label: edgeData.label || '',
        type: edgeData.type || 'related',
        ...edgeData
      },
      classes: edgeData.type || 'related'
    });
    
    // Update data model
    if (!this.data.edges) this.data.edges = [];
    this.data.edges.push(edge.data());
    
    // Add to history
    this.addToHistory();
    
    return edge;
  }

  /**
   * Remove a node from the graph
   * @param {string} nodeId - Node ID
   * @returns {boolean} Success status
   */
  removeNode(nodeId) {
    if (!this.cy) return false;
    
    const node = this.cy.getElementById(nodeId);
    if (!node.length) return false;
    
    node.remove();
    
    // Update data model
    if (this.data.nodes) {
      this.data.nodes = this.data.nodes.filter(n => n.id !== nodeId);
    }
    
    // Update edges that reference this node
    if (this.data.edges) {
      this.data.edges = this.data.edges.filter(e => 
        e.source !== nodeId && e.target !== nodeId
      );
    }
    
    // Add to history
    this.addToHistory();
    
    return true;
  }

  /**
   * Remove an edge from the graph
   * @param {string} edgeId - Edge ID
   * @returns {boolean} Success status
   */
  removeEdge(edgeId) {
    if (!this.cy) return false;
    
    const edge = this.cy.getElementById(edgeId);
    if (!edge.length) return false;
    
    edge.remove();
    
    // Update data model
    if (this.data.edges) {
      this.data.edges = this.data.edges.filter(e => e.id !== edgeId);
    }
    
    // Add to history
    this.addToHistory();
    
    return true;
  }

  /**
   * Get node or edge data by ID
   * @param {string} elementId - Element ID
   * @returns {Object|null} Element data or null if not found
   */
  getElementById(elementId) {
    if (!this.cy) return null;
    
    const element = this.cy.getElementById(elementId);
    return element.length ? element.data() : null;
  }

  /**
   * Update node or edge data
   * @param {string} elementId - Element ID
   * @param {Object} newData - New data to apply
   * @returns {boolean} Success status
   */
  updateElement(elementId, newData) {
    if (!this.cy) return false;
    
    const element = this.cy.getElementById(elementId);
    if (!element.length) return false;
    
    // Update element data
    element.data(newData);
    
    // Update element class if type changed
    if (newData.type) {
      element.classes(newData.type);
    }
    
    // Update data model
    const isNode = element.isNode();
    const dataArray = isNode ? this.data.nodes : this.data.edges;
    
    if (dataArray) {
      const index = dataArray.findIndex(item => item.id === elementId);
      if (index !== -1) {
        dataArray[index] = { ...dataArray[index], ...newData };
      }
    }
    
    // Add to history
    this.addToHistory();
    
    return true;
  }
}

// Export the SabeelKingraph class
export default SabeelKingraph;
