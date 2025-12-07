# Implementation Plan

- [x] 1. Set up project structure and build configuration
  - Create `package.json` with dependencies (webpack, terser-webpack-plugin, express)
  - Create `webpack.config.js` with Terser plugin, UMD output to `dist/woznak.min.js`
  - Create `src/index.js` as main entry point with Woznak API skeleton
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 4.1, 4.2, 4.3_

- [x] 2. Implement lexer and parser
  - Create `src/lexer.js` with Token class, TokenType enum, and Lexer class
  - Implement tokenization for keywords, operators, literals, identifiers
  - Create `src/parser.js` with AST node classes and recursive descent Parser
  - Parse variable declarations, functions, control flow, expressions
  - Wire lexer and parser into `src/index.js` (tokenize, parse methods)
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [x] 3. Implement interpreter and stdlib
  - Create `src/stdlib.js` with printf, basic math functions, and memory simulation
  - Create `src/interpreter.js` with Environment class and Interpreter class
  - Implement AST visitor methods for all node types
  - Support variable scoping, function calls, control flow execution
  - Wire interpreter into `src/index.js` (run method)
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [x] 4. Create development server
  - Create `server.js` in project root using Express
  - Serve `public/` folder at root path
  - Serve `dist/` folder at `/dist` path
  - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [x] 5. Create test interface
  - Create `public/index.html` with textarea for C code input
  - Add Run button and output display area
  - Load Woznak from `/dist/woznak.min.js`
  - Implement click handler to run code and display output/errors
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [x] 6. Final integration and build
  - Ensure all modules are properly exported in `src/index.js`
  - Run webpack build to generate `dist/woznak.min.js`
  - Verify the library loads and runs in the test interface
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 4.3_
