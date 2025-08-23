# GitHub Copilot Custom Instructions

## Project Overview

This repository follows enterprise-grade development standards with GitHub Copilot integration. All generated code must adhere to these guidelines for quality, security, and maintainability.

## Code Quality Standards

### Security and Compliance

- Always review Copilot suggestions for potential security vulnerabilities before accepting
- Ensure all generated code passes our security scanning requirements
- Check for license compliance when accepting suggestions that match public repositories
- Never include hardcoded secrets, API keys, or sensitive information in generated code

### Code Review Requirements

- All Copilot-generated code must go through the same review process as human-written code
- Include detailed comments explaining complex Copilot-generated logic
- Test all generated code thoroughly before merging
- Document any modifications made to Copilot suggestions and the reasoning

## Architecture and Patterns

### Project Structure

- Follow the established directory structure and naming conventions
- Maintain consistency with existing architectural patterns
- Use descriptive file and function names that provide clear context
- Organize related functionality into appropriate modules/packages

### Coding Standards

- Follow language-specific style guides and linting rules
- Use consistent error handling patterns throughout the codebase
- Implement proper logging and monitoring for generated code
- Ensure generated code integrates seamlessly with existing systems

## Development Workflow

### Context Provision

- Provide comprehensive context in comments when requesting complex functionality
- Break down large features into smaller, well-scoped tasks
- Include acceptance criteria and technical requirements in task descriptions
- Reference related files and dependencies when seeking code generation

### Testing Requirements

- Generate corresponding unit tests for all new functionality
- Ensure generated tests cover edge cases and error conditions
- Maintain existing test coverage standards
- Include integration tests where appropriate

### Documentation Standards

- Generate inline documentation for complex methods and classes
- Update README files when adding new features or changing functionality
- Include usage examples for new APIs or interfaces
- Maintain consistent documentation formatting

## Collaboration Guidelines

### Team Integration

- Use consistent commenting styles that other team members can understand
- Follow established Git commit message conventions for Copilot-assisted changes
- Link generated code to relevant issues and pull requests
- Maintain traceability between requirements and generated implementations

### Issue Management

- Use clear, detailed issue descriptions that serve as effective AI prompts
- Include technical specifications and constraints in task descriptions
- Break down complex features into manageable, Copilot-friendly subtasks
- Specify which files or components need modification

## Advanced Usage

### Prompt Engineering

- Begin complex requests with high-level architectural context
- Specify frameworks, libraries, and patterns being used
- Include relevant configuration details and environment constraints
- Provide examples of similar existing code when available

### Iterative Development

- Use inline chat for method-level code generation and refinement
- Leverage workspace context for better cross-file understanding
- Iterate on generated solutions based on code review feedback
- Maintain version control discipline with clear commit messages

## Validation and Quality Assurance

### Pre-commit Checks

- Ensure all generated code passes linting and formatting requirements
- Run comprehensive test suites before committing Copilot-generated code
- Validate that generated code meets performance benchmarks
- Check for accessibility compliance where applicable

### Continuous Integration

- Configure CI pipelines to validate Copilot-generated code
- Include security scanning in the CI/CD process
- Maintain code coverage thresholds with generated tests
- Document any CI-specific requirements for generated code

## File-Specific Instructions

### Configuration Files

- Maintain existing configuration patterns and structures
- Include appropriate validation and error handling
- Document configuration changes clearly
- Ensure backward compatibility where required

### API Development

- Follow established API design patterns and conventions
- Include comprehensive input validation and error handling
- Generate appropriate OpenAPI/Swagger documentation
- Implement consistent authentication and authorization patterns

### Database Integration

- Use established ORM patterns and query optimization techniques
- Include proper transaction handling and rollback mechanisms
- Generate appropriate database migrations when schema changes are needed
- Follow data privacy and security requirements

## Performance and Scalability

### Optimization Guidelines

- Generate code that follows established performance patterns
- Include appropriate caching mechanisms where beneficial
- Consider memory usage and resource management in generated code
- Implement proper connection pooling and resource cleanup

### Monitoring and Observability

- Include appropriate logging statements in generated code
- Add performance metrics and monitoring hooks where relevant
- Implement health checks for new services or components
- Include error tracking and alerting mechanisms

## Maintenance and Evolution

### Code Maintenance

- Generate code that is easy to maintain and extend
- Include TODO comments for future improvements where appropriate
- Document known limitations or technical debt in generated code
- Plan for deprecation and migration paths when introducing new patterns

### Knowledge Sharing

- Document decisions made during Copilot-assisted development
- Share effective prompts and patterns with the team
- Maintain a knowledge base of successful Copilot integration strategies
- Regular team reviews of Copilot usage and effectiveness

---

**Note**: These instructions apply to all Copilot interactions within this repository. Always prioritize code quality, security, and team collaboration over speed of development.
