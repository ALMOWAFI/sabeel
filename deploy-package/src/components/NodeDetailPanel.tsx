import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Info, Search } from "lucide-react";
import { NodeObject } from 'react-force-graph-2d';

interface NodeDetailPanelProps {
  node: NodeObject & {
    name?: string;
    group?: string;
    description?: string;
    scholars?: string[];
    books?: string[];
    era?: string;
  };
  onClose: () => void;
}

const NodeDetailPanel: React.FC<NodeDetailPanelProps> = ({ node, onClose }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
      className="absolute bottom-4 right-4 w-80 bg-white dark:bg-slate-800 rounded-lg shadow-lg p-4 z-20 border border-slate-200 dark:border-slate-700"
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{node.name}</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <Badge className="mb-2" variant="outline">
        {node.group || 'غير مصنف'}
      </Badge>
      
      {node.description && (
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">{node.description}</p>
      )}
      
      {node.scholars && node.scholars.length > 0 && (
        <div className="mb-3">
          <h4 className="text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">العلماء المرتبطون:</h4>
          <div className="flex flex-wrap gap-1">
            {node.scholars.map((scholar: string, i: number) => (
              <Badge key={i} variant="secondary">{scholar}</Badge>
            ))}
          </div>
        </div>
      )}
      
      {node.books && node.books.length > 0 && (
        <div className="mb-3">
          <h4 className="text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">الكتب المرتبطة:</h4>
          <div className="flex flex-wrap gap-1">
            {node.books.map((book: string, i: number) => (
              <Badge key={i} variant="outline">{book}</Badge>
            ))}
          </div>
        </div>
      )}
      
      {node.era && (
        <div className="text-xs text-slate-500 dark:text-slate-400 mt-2">
          الفترة الزمنية: {node.era}
        </div>
      )}
      
      <div className="flex justify-end mt-3">
        <Button variant="outline" size="sm" className="mr-2">
          <Info className="h-4 w-4 mr-1" />
          تفاصيل أكثر
        </Button>
        <Button size="sm">
          <Search className="h-4 w-4 mr-1" />
          استكشاف
        </Button>
      </div>
    </motion.div>
  );
};

export default NodeDetailPanel;