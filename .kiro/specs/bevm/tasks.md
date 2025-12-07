# Implementation Plan

- [x] 1. Set up project structure and CMake build system
  - Create root `CMakeLists.txt` with C++17, library target `bevm`, and subdirectories
  - Create `include/bevm/` and `src/` directory structure
  - Create placeholder headers: `bevm.hpp`, `types.hpp`, `instruction.hpp`, `function.hpp`, `module.hpp`, `validator.hpp`, `vm.hpp`
  - Create `src/CMakeLists.txt` for library sources
  - Verify project builds with `cmake` and `make`
  - _Requirements: 6.3, 6.4_

- [x] 2. Implement type system and instruction definitions
  - Implement `Type` enum in `types.hpp` (Void, I32, I64, F32, F64, Bool)
  - Implement `Value` struct with tagged union and factory methods (`fromI32`, `fromI64`, etc.)
  - Implement `Opcode` enum in `instruction.hpp` with all opcodes (arithmetic, stack, control flow, I/O)
  - Implement `Operand` and `Instruction` structs
  - Write unit tests for Value creation and type checking
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 2.1, 2.2, 2.3, 2.4, 2.5_

- [x] 3. Implement Function builder class
  - Implement `Function` class with constructor (name, param types, return type)
  - Implement `addLocal()` returning local index (params occupy first slots)
  - Implement all `emit*` methods for instruction emission (push, pop, arithmetic, locals, jumps, call, return, print)
  - Implement label management with `emitLabel()` returning label ID
  - Write unit tests for function building and instruction emission
  - _Requirements: 1.3, 1.4, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_

- [x] 4. Implement Module container and Validator
  - Implement `Module` class with `createFunction()`, `getFunction()`, `getFunctionIndex()`
  - Implement `ValidationResult` class with `ok()` and `fail()` factory methods
  - Implement `finalize()` to resolve labels to instruction indices
  - Implement `Validator` class with stack simulation for discipline checking
  - Validate stack height tracking, merge point validation, and type checking
  - Write unit tests for module creation, validation pass/fail scenarios
  - _Requirements: 1.1, 1.2, 1.5, 3.1, 3.2, 3.3, 3.4, 3.5, 5.6_

- [x] 5. Implement Virtual Machine executor
  - Implement `VM` class with `execute()` methods (entry function, optional args)
  - Implement `executeFunction()` with stack and locals management
  - Implement `dispatch()` for all opcodes: stack ops, arithmetic, comparisons, locals, control flow
  - Implement function call handling (push args, execute, return value)
  - Implement `Print` opcode outputting to stdout
  - Implement `RuntimeError` exception for runtime errors (div by zero, invalid call)
  - Write unit tests for VM execution of various instruction sequences
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 7.1, 7.2, 7.3, 7.4_

- [x] 6. Implement BASM compiler example
  - Create `basm-compiler/` directory with `CMakeLists.txt` linked to bevm library
  - Implement `Lexer` class to tokenize BASM source (keywords, identifiers, numbers, labels)
  - Implement `Parser` class to build AST (function definitions, instruction lists)
  - Implement `CodeGen` class using BeVM API to emit bytecode from AST
  - Implement `main.cpp` that reads BASM file, compiles, validates, and executes
  - Create `examples/factorial.basm` demonstrating arithmetic, locals, control flow, function calls, print
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6_

- [x] 7. Add integration tests and finalize build
  - Create `tests/` directory with `CMakeLists.txt` using Google Test
  - Write integration test: build module via API → validate → execute → verify output
  - Write integration test: compile BASM example → execute → verify output
  - Ensure all tests pass and project builds cleanly
  - Update root `CMakeLists.txt` to include tests as optional target
  - _Requirements: 6.1, 6.2, 6.5_
