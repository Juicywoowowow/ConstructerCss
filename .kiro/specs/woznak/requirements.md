# Requirements Document

## Introduction

Woznak is a C language emulator implemented in pure JavaScript, inspired by Fengari (which emulates Lua in JS). The library will be compiled and bundled using Webpack with the Terser plugin for minification, outputting to a `dist` folder. The project includes a development server that serves both the public folder (containing a test interface) and the dist folder. The public folder contains an `index.html` page where users can write and test C code against the Woznak library.

## Requirements

### Requirement 1: C Language Parser

**User Story:** As a developer, I want Woznak to parse C source code into an Abstract Syntax Tree (AST), so that the code can be analyzed and executed.

#### Acceptance Criteria

1. WHEN C source code is provided THEN the parser SHALL tokenize the input into lexical tokens
2. WHEN tokens are generated THEN the parser SHALL construct an AST representing the program structure
3. WHEN the parser encounters syntax errors THEN it SHALL throw descriptive error messages with line numbers
4. The parser SHALL support basic C constructs including:
   - Variable declarations (int, float, char, double)
   - Functions with parameters and return values
   - Control flow (if/else, while, for, switch)
   - Operators (arithmetic, logical, comparison, bitwise)
   - Arrays and pointers (basic support)
   - Structs (basic support)

### Requirement 2: C Runtime/Interpreter

**User Story:** As a developer, I want Woznak to execute parsed C code, so that I can run C programs in the browser.

#### Acceptance Criteria

1. WHEN an AST is provided THEN the interpreter SHALL execute the program and produce output
2. WHEN the program uses printf THEN the interpreter SHALL capture and return the output
3. WHEN the program has a main function THEN the interpreter SHALL use it as the entry point
4. WHEN runtime errors occur THEN the interpreter SHALL throw descriptive error messages
5. The interpreter SHALL support:
   - Variable scoping (global and local)
   - Function calls and recursion
   - Memory simulation for basic pointer operations
   - Standard library functions (printf, scanf simulation, basic math)

### Requirement 3: Webpack Build Configuration

**User Story:** As a developer, I want the library bundled and minified via Webpack, so that it can be easily distributed and used in web applications.

#### Acceptance Criteria

1. WHEN running the build command THEN Webpack SHALL compile all source files into a single bundle
2. WHEN building for production THEN Terser plugin SHALL minify the output
3. WHEN the build completes THEN the output SHALL be placed in the `dist` folder
4. The bundle SHALL expose a global `Woznak` object for browser usage
5. The bundle SHALL support both UMD and ES module formats

### Requirement 4: Project Structure

**User Story:** As a developer, I want a simple source folder structure, so that the codebase is easy to work with.

#### Acceptance Criteria

1. The project SHALL have a `src` folder containing all Woznak source files (flat structure)
2. The `src` folder SHALL contain:
   - `index.js` - Main entry point
   - `lexer.js` - Tokenization logic
   - `parser.js` - AST generation
   - `interpreter.js` - Runtime execution
   - `stdlib.js` - Standard library implementations
3. WHEN importing Woznak THEN the main entry point SHALL export all public APIs

### Requirement 5: Development Server

**User Story:** As a developer, I want a development server to test the library, so that I can quickly iterate and debug.

#### Acceptance Criteria

1. WHEN running the server THEN it SHALL serve files from both `public` and `dist` folders
2. The server SHALL be implemented in a `server.js` file in the project root
3. WHEN accessing the root URL THEN the server SHALL serve `public/index.html`
4. WHEN accessing `/dist/*` THEN the server SHALL serve files from the `dist` folder

### Requirement 6: Test Interface

**User Story:** As a developer, I want an HTML interface to write and test C code, so that I can verify the library works correctly.

#### Acceptance Criteria

1. The `public/index.html` SHALL include a text area for writing C code
2. The interface SHALL include a "Run" button to execute the code
3. WHEN the Run button is clicked THEN the interface SHALL display the program output
4. IF an error occurs THEN the interface SHALL display the error message
5. The interface SHALL load the Woznak library from the dist folder
