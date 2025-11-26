# Variable Aggregation Logic Modeling Tool

> [中文文档](README.zh-CN.md) | English

A visual logic modeling and simulation tool built on LiteGraph.js, supporting the construction of complex logical relationship models through node graphs.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Core Features](#core-features)
- [Node Types](#node-types)
- [Data Management](#data-management)
- [Deployment](#deployment)

## 🎯 Project Overview

This project is a browser-based visual logic modeling tool that allows users to build complex logical relationship graphs by dragging and dropping nodes. The system supports real-time simulation, persistent data storage, and flexible import/export functionality.

## ✨ Features

### 1. Visual Node Editing
- Powerful node graph editor based on LiteGraph.js
- Interactive operations: drag, zoom, pan
- Real-time node connection for building logical relationships
- Grid alignment and automatic layout

### 2. Logic Simulation
- One-click start/stop simulation
- Real-time node output calculation
- Support for complex logic chain execution

### 3. Data Management
- **Local Storage**: Data saved to localStorage
- **IndexedDB Storage**: Support for large-scale data record storage
- **Data Record List**: Left panel displays all saved records
  - Smart relative time display (just now, X minutes ago, X hours ago, etc.)
  - Edit record titles
  - One-click quick import of historical records
  - Delete records support

### 4. Import/Export
- **Copy to Clipboard**: One-click copy of current graph data (JSON format)
- **Paste Import**: Paste JSON data from clipboard and import
- **Serialization Save**: Save to local storage and IndexedDB
- **Load from Local Storage**: Quickly load recently saved data

### 5. User Interface
- Modern UI design (based on Mantine UI)
- Beautiful button styles with different colors for different functions
- Responsive layout design
- Friendly error prompts and success notifications

## 🛠 Tech Stack

- **Frontend Framework**: React 18.3.1
- **UI Component Library**: Mantine 7.11.1
- **Graphics Engine**: LiteGraph.js
- **Styling**: Tailwind CSS 3.4.4
- **State Management**: Zustand 4.5.4
- **Data Storage**: IndexedDB, localStorage
- **Build Tool**: React Scripts 5.0.1
- **Language**: TypeScript

## 🚀 Quick Start

### Requirements

- Node.js >= 14.0.0
- npm or yarn

### Install Dependencies

```bash
# Using yarn (recommended)
yarn install

# Or using npm
npm install
```

### Start Development Server

```bash
cd packages/main-package
npm run start
```

The project will start at `http://localhost:3000`.

### Build for Production

```bash
cd packages/main-package
npm run build
```

## 📁 Project Structure

```
use-lite-graph/
├── packages/
│   ├── main-package/          # Main application package
│   │   ├── src/
│   │   │   ├── components/    # React components
│   │   │   │   ├── Serialize.tsx          # Serialization control component
│   │   │   │   ├── DataRecordList.tsx     # Data record list
│   │   │   │   └── ModifyModal.tsx        # Modify modal
│   │   │   ├── extends/       # Extended features
│   │   │   │   ├── Graph.ts              # Graph instance management
│   │   │   │   ├── Demo.ts               # Example node definitions
│   │   │   │   ├── nodes/                # Custom nodes
│   │   │   │   │   ├── RawDefineNode.ts      # Raw definition node
│   │   │   │   │   ├── EqualAssertNode.ts    # Assertion node
│   │   │   │   │   ├── AndOperateNode.ts     # AND operation node
│   │   │   │   │   ├── OrOperateNode.ts      # OR operation node
│   │   │   │   │   ├── OutputNode.ts         # Output node
│   │   │   │   │   └── MultiOutputNode.ts    # Multi-output node
│   │   │   │   └── App.tsx               # Main application component
│   │   │   ├── LiteGraph/     # LiteGraph core library
│   │   │   ├── utils/         # Utility functions
│   │   │   │   └── indexedDB.ts          # IndexedDB management
│   │   │   └── store/         # State management
│   │   └── public/            # Static resources
│   └── litegraph.js/          # LiteGraph library source code
├── package.json
└── readme.md
```

## 🎨 Core Features

### Node Graph Editing

On the canvas you can:
- Right-click to create new nodes
- Drag nodes to adjust position
- Connect node input/output ports
- Double-click nodes to edit properties
- Use mouse wheel to zoom canvas
- Drag canvas to pan view

### Data Serialization

All graph data can be serialized to JSON format, including:
- Node information (position, properties, connections)
- Link relationships
- Configuration information
- Version information

### Data Record Management

The left data record list provides:
- **Auto-save**: Automatically added to record list when clicking "Save to LS & DB"
- **Time Display**: Smart relative time display (just now, X minutes ago, X hours ago, etc.)
- **Title Editing**: Click edit icon to modify record title
- **Quick Import**: Click record item to import to canvas
- **Delete Records**: Support for deleting unwanted records

## 🔧 Node Types

### 1. RawDefineNode (Raw Definition Node)
- **Function**: Define raw variable values
- **Input**: None
- **Output**: Variable value (number or boolean)
- **Properties**: Can set value, precision, step, etc.

### 2. EqualAssertNode (Assertion Node)
- **Function**: Execute conditional assertion, judge if input satisfies expression
- **Input**: Variable value
- **Output**: Boolean value (true/false)
- **Properties**: Editable expression (use `input` to represent input variable)

### 3. AndOperateNode (AND Operation Node)
- **Function**: Execute logical AND operation
- **Input**: Multiple boolean values
- **Output**: Logical AND result of all inputs

### 4. OrOperateNode (OR Operation Node)
- **Function**: Execute logical OR operation
- **Input**: Multiple boolean values
- **Output**: Logical OR result of all inputs

### 5. OutputNode (Output Node)
- **Function**: Output final result
- **Input**: Calculation result
- **Output**: Displayed on the node

### 6. MultiOutputNode (Multi-Output Node)
- **Function**: Support multiple output ports
- **Input**: Multiple input values
- **Output**: Multiple output values

## 💾 Data Management

### Save Data

Click "Save to LS & DB" button:
1. Data saved to localStorage (key: `litegrapheditor_clipboard`)
2. Data simultaneously saved to IndexedDB
3. Automatically added to left data record list
4. Display save success notification

### Load Data

**Method 1: Load from Local Storage**
- Click "Load from LS" button
- Load recently saved data from localStorage

**Method 2: Import from Record List**
- Click any record in the left record list
- Automatically import to canvas

**Method 3: Paste Import**
- Click "Import" button
- Paste JSON data in the popup
- Click "Import" to complete loading

### Export Data

**Copy to Clipboard**
- Click "Copy" button
- Current graph data copied to clipboard as formatted JSON
- Can be pasted to other applications or saved as file

## 🎮 User Guide

### Basic Operations

1. **Create Node**: Right-click canvas, select node type
2. **Connect Nodes**: Drag from output port to input port
3. **Edit Node**: Double-click node to open edit panel
4. **Delete Node**: Select node and press Delete key
5. **Move Node**: Drag node to new position

### Simulation Operations

1. **Start Simulation**: Click "▶ Start Simulation" button
2. **Stop Simulation**: Click "⏹ Stop Simulation" button
3. Nodes will calculate and update output in real-time during simulation

### Data Operations

1. **Save**: Click "💾 Save to LS & DB"
2. **Load**: Click "📂 Load from LS" or select from record list
3. **Copy**: Click "📋 Copy" to copy to clipboard
4. **Import**: Click "📥 Import" to paste JSON data
5. **Load Example**: Click "🎯 Load Demo" to load example nodes

## 🌐 Deployment

Project deployed at: [http://var_logic_model.surge.sh](http://var_logic_model.surge.sh)

### Local Deployment

```bash
cd packages/main-package
npm run build
# Build artifacts in build/ directory
```

## 📝 Development Guide

### Adding New Node Types

1. Create new node file in `src/extends/nodes/` directory
2. Extend `LGraphNode` class
3. Implement node input/output and calculation logic
4. Register node type in `src/extends/Graph.ts`
5. Add example in `src/extends/Demo.ts` (optional)

### Custom Styling

The project uses Tailwind CSS, you can use Tailwind class names in components. Global styles are defined in `src/extends/App.css`.

## 🤝 Contributing

Issues and Pull Requests are welcome!

## 📄 License

This project is built on LiteGraph.js, please refer to the relevant license files.

---

**Note**: The project code is located in the `packages/main-package` directory.
