# Requirements Document

## Introduction

BeVM is a simple, lightweight virtual machine and code generation framework inspired by LLVM but with a much narrower scope. It provides a C/C++ API that language implementers can use to generate stack-based bytecode at runtime. The VM executes this bytecode via JIT compilation, producing output directly without generating intermediate files. BeVM follows stack discipline similar to WebAssembly but uses its own unique bytecode syntax. The implementation uses modern C++ with smart pointers (unique_ptr/shared_ptr) and builds via CMake.

## Requirements

### Requirement 1: C/C++ API for Code Generation

**User Story:** As a language implementer, I want a clean C/C++ API to generate BeVM bytecode, so that I can build my own programming language on top of BeVM.

#### Acceptance Criteria

1. WHEN a user includes the BeVM header THEN the system SHALL expose a public API for creating modules, functions, and instructions.
2. WHEN a user creates a new module THEN the system SHALL return a handle to a module object that can contain multiple functions.
3. WHEN a user defines a function THEN the system SHALL allow specifying parameter types and return type.
4. WHEN a user emits instructions THEN the system SHALL validate stack discipline at code generation time.
5. IF the user attempts to emit an invalid instruction sequence THEN the system SHALL report an error with a descriptive message.

### Requirement 2: Stack-Based Instruction Set

**User Story:** As a language implementer, I want a well-defined stack-based instruction set, so that I can generate correct bytecode for my language constructs.

#### Acceptance Criteria

1. WHEN generating arithmetic operations THEN the system SHALL provide instructions for add, subtract, multiply, divide, and modulo.
2. WHEN generating stack manipulation THEN the system SHALL provide push, pop, dup, and swap instructions.
3. WHEN generating control flow THEN the system SHALL provide jump, conditional jump, call, and return instructions.
4. WHEN generating comparisons THEN the system SHALL provide equal, not-equal, less-than, greater-than, less-equal, and greater-equal instructions.
5. WHEN generating local variable access THEN the system SHALL provide load and store instructions with local indices.
6. WHEN calling functions THEN the system SHALL provide a call instruction that invokes other BeVM functions by name or index.
7. IF an instruction pops more values than available on the stack THEN the system SHALL reject the code during validation.

### Requirement 3: Stack Discipline Validation

**User Story:** As a language implementer, I want the VM to enforce stack discipline like WebAssembly, so that my generated code is guaranteed to be safe at runtime.

#### Acceptance Criteria

1. WHEN a function is defined THEN the system SHALL track expected stack height at each instruction.
2. WHEN a function completes THEN the system SHALL verify the stack contains exactly the return value(s).
3. WHEN control flow merges (e.g., after conditionals) THEN the system SHALL verify stack heights match on all paths.
4. IF stack discipline is violated THEN the system SHALL reject the module with a clear error message.
5. WHEN validating a module THEN the system SHALL perform validation before bytecode execution.

### Requirement 4: Bytecode Generation and VM Execution

**User Story:** As a language implementer, I want BeVM to generate bytecode and execute it via its VM at runtime, so that I can run programs without generating output files.

#### Acceptance Criteria

1. WHEN a module is finalized THEN the system SHALL generate BeVM bytecode (its own VM language).
2. WHEN execution is requested THEN the system SHALL interpret/execute the bytecode via the BeVM virtual machine.
3. WHEN a function produces output THEN the system SHALL display it to stdout.
4. IF bytecode generation fails THEN the system SHALL report an error without crashing.
5. WHEN executing THEN the system SHALL NOT produce any intermediate or output files.
6. WHEN executing THEN the system SHALL support calling other BeVM functions within the same module.

### Requirement 5: Type System

**User Story:** As a language implementer, I want BeVM to support basic types, so that I can represent common data in my language.

#### Acceptance Criteria

1. WHEN defining values THEN the system SHALL support 32-bit integers (i32).
2. WHEN defining values THEN the system SHALL support 64-bit integers (i64).
3. WHEN defining values THEN the system SHALL support 32-bit floats (f32).
4. WHEN defining values THEN the system SHALL support 64-bit floats (f64).
5. WHEN defining values THEN the system SHALL support boolean values.
6. WHEN type mismatches occur during validation THEN the system SHALL report a type error.

### Requirement 6: Modern C++ Implementation

**User Story:** As a maintainer, I want BeVM implemented with modern C++ idioms, so that the codebase is safe and maintainable.

#### Acceptance Criteria

1. WHEN managing object lifetimes THEN the system SHALL use std::unique_ptr for exclusive ownership.
2. WHEN managing shared resources THEN the system SHALL use std::shared_ptr for shared ownership.
3. WHEN building the project THEN the system SHALL use CMake as the build system.
4. WHEN compiling THEN the system SHALL target C++17 or later.
5. WHEN handling errors THEN the system SHALL use exceptions or error codes consistently (no raw error states).

### Requirement 7: Print/Output Capability

**User Story:** As a language implementer, I want a built-in print instruction, so that programs can produce visible output.

#### Acceptance Criteria

1. WHEN a print instruction is executed THEN the system SHALL output the top stack value to stdout.
2. WHEN printing integers THEN the system SHALL format them as decimal strings.
3. WHEN printing floats THEN the system SHALL format them with reasonable precision.
4. WHEN printing booleans THEN the system SHALL output "true" or "false".

### Requirement 8: Example Language (basm-compiler)

**User Story:** As a developer evaluating BeVM, I want an example language implementation, so that I can see how to use the BeVM API to build a compiler.

#### Acceptance Criteria

1. WHEN the project is built THEN the system SHALL include a `basm-compiler` folder in the project root.
2. WHEN examining basm-compiler THEN the system SHALL provide a simple assembly-like language ("BASM") implemented in C++.
3. WHEN the BASM compiler runs THEN the system SHALL parse BASM source code and use BeVM's code generation API to produce bytecode.
4. WHEN BASM code is compiled THEN the system SHALL execute it via BeVM and display output.
5. WHEN examining basm-compiler THEN the system SHALL demonstrate core BeVM features: arithmetic, locals, control flow, function calls, and print.
6. WHEN building the project THEN the system SHALL build basm-compiler as part of the CMake build.
