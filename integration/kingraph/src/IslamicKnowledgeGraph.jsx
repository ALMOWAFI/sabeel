import React, { useEffect, useRef, useState } from 'react';
import SabeelKingraph from './kingraph';
import scholarNetwork from '../examples/islamic_scholars_network.json';

/**
 * Islamic Knowledge Graph Component
 * 
 * This component provides an interactive visualization of Islamic knowledge using
 * the SabeelKingraph library. It allows users to explore relationships between
 * scholars, books, concepts, schools of thought, and other Islamic knowledge elements.
 */
const IslamicKnowledgeGraph = ({ 
  data = null, 
  height = "600px", 
  width = "100%", 
  theme = "light",
  onNodeClick = null,
  onEdgeClick = null,
  showControls = true,
  enableSearch = true
}) => {
  // Create refs for the container and graph instance
  const containerRef = useRef(null);
  const graphRef = useRef(null);
  
  // State for search input and results
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [graphData, setGraphData] = useState(data || scholarNetwork);
  const [nodeTypes, setNodeTypes] = useState([]);

  // Effect to initialize the graph
  useEffect(() => {
    if (containerRef.current && !graphRef.current) {
      // Initialize the graph
      graphRef.current = new SabeelKingraph({
        container: containerRef.current,
        theme,
        onNodeClick: handleNodeClick,
        onEdgeClick: handleEdgeClick
      });
      
      // Load data
      if (graphData) {
        graphRef.current.loadData(graphData);
        
        // Extract unique node types for the filter
        const types = [...new Set(graphData.nodes.map(node => node.type))];
        setNodeTypes(types);
      }
    }
    
    // Clean up on unmount
    return () => {
      if (graphRef.current) {
        // No explicit destroy method in our implementation, but could be added
        graphRef.current = null;
      }
    };
  }, []);
  
  // Effect to handle theme changes
  useEffect(() => {
    if (graphRef.current) {
      graphRef.current.applyTheme(theme);
    }
  }, [theme]);
  
  // Effect to handle data changes
  useEffect(() => {
    if (graphRef.current && data) {
      graphRef.current.loadData(data);
      setGraphData(data);
      
      // Extract unique node types for the filter
      const types = [...new Set(data.nodes.map(node => node.type))];
      setNodeTypes(types);
    }
  }, [data]);
  
  // Handle node click
  const handleNodeClick = (nodeData) => {
    setSelectedNodeId(nodeData.id);
    
    // Call external handler if provided
    if (onNodeClick) {
      onNodeClick(nodeData);
    }
  };
  
  // Handle edge click
  const handleEdgeClick = (edgeData) => {
    // Call external handler if provided
    if (onEdgeClick) {
      onEdgeClick(edgeData);
    }
  };
  
  // Handle search
  const handleSearch = () => {
    if (!searchTerm.trim() || !graphRef.current) {
      setSearchResults([]);
      return;
    }
    
    const results = graphRef.current.search({
      text: searchTerm
    });
    
    setSearchResults(Array.from(results).map(node => node.data()));
  };
  
  // Handle search input change
  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value);
    if (e.target.value === '') {
      setSearchResults([]);
    }
  };
  
  // Handle search result click
  const handleSearchResultClick = (nodeId) => {
    if (graphRef.current) {
      const node = graphRef.current.cy.getElementById(nodeId);
      if (node.length) {
        graphRef.current.cy.fit(node, 50);
        graphRef.current.highlightConnectedElements(node);
        setSelectedNodeId(nodeId);
      }
    }
    
    // Clear search results
    setSearchResults([]);
    setSearchTerm("");
  };
  
  // Handle filter by type
  const handleFilterByType = (type) => {
    if (!graphRef.current) return;
    
    // If "all" is selected, show all nodes
    if (type === "all") {
      graphRef.current.cy.nodes().removeClass('filtered-out');
      graphRef.current.cy.edges().removeClass('filtered-out');
      return;
    }
    
    // Hide nodes that don't match the selected type
    graphRef.current.cy.nodes().forEach(node => {
      if (node.data('type') !== type) {
        node.addClass('filtered-out');
      } else {
        node.removeClass('filtered-out');
      }
    });
    
    // Hide edges that connect to hidden nodes
    graphRef.current.cy.edges().forEach(edge => {
      const source = graphRef.current.cy.getElementById(edge.data('source'));
      const target = graphRef.current.cy.getElementById(edge.data('target'));
      
      if (source.hasClass('filtered-out') || target.hasClass('filtered-out')) {
        edge.addClass('filtered-out');
      } else {
        edge.removeClass('filtered-out');
      }
    });
  };
  
  // Handle reset graph
  const handleResetGraph = () => {
    if (graphRef.current) {
      graphRef.current.cy.nodes().removeClass('filtered-out highlighted');
      graphRef.current.cy.edges().removeClass('filtered-out highlighted');
      graphRef.current.cy.fit();
      setSelectedNodeId(null);
    }
  };
  
  // Handle graph export
  const handleExport = (format) => {
    if (graphRef.current) {
      graphRef.current.download(format, 'islamic-knowledge-graph');
    }
  };
  
  // Render node details sidebar if a node is selected
  const renderNodeDetails = () => {
    if (!selectedNodeId || !graphRef.current) return null;
    
    const nodeData = graphRef.current.getElementById(selectedNodeId);
    if (!nodeData) return null;
    
    return (
      <div className="node-details-sidebar">
        <h3>{nodeData.label || nodeData.id}</h3>
        <div className="node-type-badge" style={{ backgroundColor: getNodeTypeColor(nodeData.type) }}>
          {nodeData.type}
        </div>
        
        {nodeData.description && (
          <p className="node-description">{nodeData.description}</p>
        )}
        
        <dl className="node-properties">
          {Object.entries(nodeData).map(([key, value]) => {
            // Skip certain properties
            if (['id', 'label', 'type', 'description'].includes(key)) return null;
            return (
              <React.Fragment key={key}>
                <dt>{key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ')}</dt>
                <dd>{value}</dd>
              </React.Fragment>
            );
          })}
        </dl>
        
        <button className="close-details-btn" onClick={() => setSelectedNodeId(null)}>
          Close
        </button>
      </div>
    );
  };
  
  // Helper to get color for node type
  const getNodeTypeColor = (type) => {
    const colors = {
      scholar: '#10B981',
      concept: '#6366F1',
      book: '#0F172A',
      hadith: '#8B5CF6',
      verse: '#FBBF24',
      school: '#F43F5E',
      event: '#475569'
    };
    
    return colors[type] || '#999';
  };
  
  return (
    <div className="islamic-knowledge-graph-component">
      {showControls && (
        <div className={`graph-controls ${theme === 'dark' ? 'dark' : 'light'}`}>
          {enableSearch && (
            <div className="search-container">
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchInputChange}
                placeholder="Search nodes..."
                className="search-input"
              />
              <button onClick={handleSearch} className="search-button">
                Search
              </button>
              
              {searchResults.length > 0 && (
                <div className="search-results">
                  {searchResults.map(result => (
                    <div 
                      key={result.id} 
                      className="search-result-item"
                      onClick={() => handleSearchResultClick(result.id)}
                    >
                      <span className="result-label">{result.label}</span>
                      <span className="result-type" style={{ backgroundColor: getNodeTypeColor(result.type) }}>
                        {result.type}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          <div className="filter-container">
            <label htmlFor="node-type-filter">Filter by type:</label>
            <select 
              id="node-type-filter" 
              onChange={(e) => handleFilterByType(e.target.value)}
              className="node-type-filter"
            >
              <option value="all">All types</option>
              {nodeTypes.map(type => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>
          
          <div className="button-container">
            <button onClick={handleResetGraph} className="reset-button">
              Reset View
            </button>
            
            <div className="export-buttons">
              <button onClick={() => handleExport('png')} className="export-button">
                Export PNG
              </button>
              <button onClick={() => handleExport('svg')} className="export-button">
                Export SVG
              </button>
              <button onClick={() => handleExport('json')} className="export-button">
                Export JSON
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div 
        ref={containerRef} 
        className={`graph-container ${theme === 'dark' ? 'dark' : 'light'}`}
        style={{ height, width }}
      ></div>
      
      {selectedNodeId && renderNodeDetails()}
      
      <style jsx>{`
        .islamic-knowledge-graph-component {
          position: relative;
          font-family: Arial, sans-serif;
          display: flex;
          flex-direction: column;
        }
        
        .graph-container {
          border: 1px solid #ddd;
          border-radius: 8px;
          overflow: hidden;
        }
        
        .graph-container.dark {
          border-color: #334155;
        }
        
        .graph-controls {
          padding: 10px;
          margin-bottom: 10px;
          background-color: #f8fafc;
          border-radius: 8px;
          border: 1px solid #ddd;
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }
        
        .graph-controls.dark {
          background-color: #1E293B;
          border-color: #334155;
          color: #fff;
        }
        
        .search-container {
          position: relative;
          flex: 1;
          min-width: 200px;
        }
        
        .search-input {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
        }
        
        .graph-controls.dark .search-input {
          background-color: #334155;
          border-color: #475569;
          color: #fff;
        }
        
        .search-button {
          position: absolute;
          right: 5px;
          top: 5px;
          padding: 4px 8px;
          background-color: #10B981;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        
        .search-results {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background-color: white;
          border: 1px solid #ddd;
          border-radius: 4px;
          margin-top: 5px;
          max-height: 200px;
          overflow-y: auto;
          z-index: 10;
        }
        
        .graph-controls.dark .search-results {
          background-color: #334155;
          border-color: #475569;
        }
        
        .search-result-item {
          padding: 8px 12px;
          border-bottom: 1px solid #eee;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .graph-controls.dark .search-result-item {
          border-color: #475569;
        }
        
        .search-result-item:hover {
          background-color: #f1f5f9;
        }
        
        .graph-controls.dark .search-result-item:hover {
          background-color: #1E293B;
        }
        
        .result-type {
          font-size: 12px;
          padding: 2px 6px;
          border-radius: 10px;
          color: white;
        }
        
        .filter-container {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .node-type-filter {
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
          background-color: white;
        }
        
        .graph-controls.dark .node-type-filter {
          background-color: #334155;
          border-color: #475569;
          color: #fff;
        }
        
        .button-container {
          display: flex;
          gap: 10px;
          align-items: center;
        }
        
        .reset-button, .export-button {
          padding: 8px 12px;
          background-color: #6366F1;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        }
        
        .export-buttons {
          display: flex;
          gap: 5px;
        }
        
        .export-button {
          background-color: #0F172A;
          font-size: 12px;
          padding: 6px 10px;
        }
        
        .node-details-sidebar {
          position: absolute;
          top: 10px;
          left: 10px;
          width: 300px;
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          padding: 15px;
          z-index: 5;
          max-height: calc(100% - 20px);
          overflow-y: auto;
          border: 1px solid #ddd;
        }
        
        .node-type-badge {
          display: inline-block;
          padding: 3px 8px;
          border-radius: 10px;
          color: white;
          font-size: 12px;
          margin-bottom: 10px;
        }
        
        .node-description {
          margin-bottom: 15px;
          line-height: 1.5;
        }
        
        .node-properties {
          margin: 0;
          padding: 0;
        }
        
        .node-properties dt {
          font-weight: bold;
          margin-top: 10px;
          font-size: 14px;
        }
        
        .node-properties dd {
          margin-left: 0;
          margin-bottom: 5px;
          padding-bottom: 5px;
          border-bottom: 1px solid #eee;
        }
        
        .close-details-btn {
          margin-top: 15px;
          padding: 8px 12px;
          background-color: #6366F1;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          width: 100%;
        }
      `}</style>
    </div>
  );
};

export default IslamicKnowledgeGraph;
