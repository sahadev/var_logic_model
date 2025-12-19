import React from 'react';
import { getInstance } from '../extends/Graph';
import './ZoomControls.css';

export const ZoomControls: React.FC = () => {
  const handleZoomIn = () => {
    const graphInstance = getInstance();
    const canvas = graphInstance.canvas;
    const currentScale = canvas.ds.scale;
    // 使用很小的步长，例如1.02 (2%的增量)
    const newScale = currentScale * 1.02;
    // 以画布中心为缩放中心
    const center = canvas.canvas 
      ? [canvas.canvas.width * 0.5, canvas.canvas.height * 0.5]
      : undefined;
    canvas.setZoom(newScale, center);
  };

  const handleZoomOut = () => {
    const graphInstance = getInstance();
    const canvas = graphInstance.canvas;
    const currentScale = canvas.ds.scale;
    // 使用很小的步长，例如0.98 (2%的减量)
    const newScale = currentScale * 0.98;
    // 以画布中心为缩放中心
    const center = canvas.canvas 
      ? [canvas.canvas.width * 0.5, canvas.canvas.height * 0.5]
      : undefined;
    canvas.setZoom(newScale, center);
  };

  return (
    <div className="zoom-controls">
      <button 
        className="zoom-button zoom-in" 
        onClick={handleZoomIn}
        title="放大"
        aria-label="放大画布"
      >
        +
      </button>
      <button 
        className="zoom-button zoom-out" 
        onClick={handleZoomOut}
        title="缩小"
        aria-label="缩小画布"
      >
        −
      </button>
    </div>
  );
};
