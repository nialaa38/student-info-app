import { render, screen, cleanup } from '@testing-library/react';
import * as fc from 'fast-check';
import StudentComponent, { type Student } from '../Student';

// Clean up after each test to prevent DOM pollution
afterEach(cleanup);

/**
 * Property-Based Tests for Student Component Data Display
 * 
 * **Feature: student-info-app, Property 1: Student Data Display Consistency**
 * **Validates: Requirements 2.3, 6.1, 6.2, 6.4**
 * 
 * For any valid student object with name, course, and year fields, when displayed 
 * through the Student Component, all required fields should be visible in the 
 * rendered output and formatted consistently regardless of the specific values.
 */

// Generator for valid student names (printable characters only, no control chars)
const studentNameArbitrary = fc.string({ 
  minLength: 1, 
  maxLength: 50 
}).filter(name => {
  const trimmed = name.trim();
  // Only allow printable ASCII characters and common Unicode letters
  return trimmed.length > 0 && /^[\x20-\x7E\u00C0-\u017F\u0100-\u024F]+$/.test(trimmed);
});

// Generator for valid course names (printable characters only)
const courseNameArbitrary = fc.string({ 
  minLength: 1, 
  maxLength: 80 
}).filter(course => {
  const trimmed = course.trim();
  return trimmed.length > 0 && /^[\x20-\x7E\u00C0-\u017F\u0100-\u024F\s]+$/.test(trimmed);
});

// Generator for valid academic years (1-4 as typical undergraduate years)
const academicYearArbitrary = fc.integer({ min: 1, max: 4 });

// Generator for valid student IDs (positive integers)
const studentIdArbitrary = fc.integer({ min: 1, max: 999999 });

// Generator for optional email addresses (simple format)
const emailArbitrary = fc.option(
  fc.record({
    user: fc.string({ minLength: 1, maxLength: 20 }).filter(s => /^[a-z0-9]+$/.test(s)),
    domain: fc.constantFrom('example.com', 'test.edu', 'university.org', 'school.net')
  }).map(({ user, domain }) => `${user}@${domain}`),
  { nil: undefined }
);

// Generator for complete valid Student objects
const validStudentArbitrary: fc.Arbitrary<Student> = fc.record({
  id: studentIdArbitrary,
  name: studentNameArbitrary,
  course: courseNameArbitrary,
  year: academicYearArbitrary,
  email: emailArbitrary
});

describe('Student Component - Property-Based Tests', () => {
  describe('Property 1: Student Data Display Consistency', () => {
    /**
     * **Validates: Requirements 2.3, 6.1, 6.2, 6.4**
     * 
     * Property: For any valid student object with name, course, and year fields,
     * when displayed through the Student Component, all required fields should be
     * visible in the rendered output and formatted consistently regardless of the
     * specific values.
     */
    test('all required student fields are consistently displayed for any valid student data', () => {
      fc.assert(
        fc.property(validStudentArbitrary, (student) => {
          // Clean up before each property test iteration
          cleanup();
          
          // Render the Student component with the generated student data
          render(<StudentComponent student={student} />);
          
          // Property 1.1: Student card container should always be present with correct test ID
          const studentCard = screen.getByTestId(`student-${student.id}`);
          expect(studentCard).toBeInTheDocument();
          expect(studentCard).toHaveClass('student-card');
          
          // Property 1.2: Student name should always be displayed as a heading
          const nameElement = screen.getByRole('heading', { level: 3 });
          expect(nameElement).toBeInTheDocument();
          expect(nameElement).toHaveTextContent(student.name);
          expect(nameElement).toHaveClass('student-name');
          
          // Property 1.3: Course should always be displayed with consistent formatting
          const courseElement = screen.getByText(student.course);
          expect(courseElement).toBeInTheDocument();
          expect(courseElement).toHaveClass('student-course');
          
          // Property 1.4: Year should always be displayed with "Year X" format
          const yearElement = screen.getByText(`Year ${student.year}`);
          expect(yearElement).toBeInTheDocument();
          expect(yearElement).toHaveClass('student-year');
          
          // Property 1.5: Expand button should always be present and functional
          const expandButton = screen.getByRole('button');
          expect(expandButton).toBeInTheDocument();
          expect(expandButton).toHaveClass('expand-button');
          expect(expandButton).toHaveAttribute('aria-expanded', 'false');
          expect(expandButton).toHaveAttribute('type', 'button');
          
          // Property 1.6: Aria-label should include student name for accessibility
          const ariaLabel = expandButton.getAttribute('aria-label');
          expect(ariaLabel).toContain(student.name);
          expect(ariaLabel).toMatch(/^(Expand|Collapse) details for .+$/);
          
          // Property 1.7: Required CSS structure should be consistent
          const header = studentCard.querySelector('.student-header');
          const basicInfo = studentCard.querySelector('.student-basic-info');
          const details = studentCard.querySelector('.student-details');
          
          expect(header).toBeInTheDocument();
          expect(basicInfo).toBeInTheDocument();
          expect(details).toBeInTheDocument();
          
          // Property 1.8: All required fields should be contained within proper structure
          expect(basicInfo).toContainElement(nameElement);
          expect(details).toContainElement(courseElement);
          expect(details).toContainElement(yearElement);
        }),
        { 
          numRuns: 100,
          verbose: false, // Reduce verbosity to avoid overwhelming output
          seed: 42 // For reproducible test runs
        }
      );
    });

    test('expanded content displays all student information consistently', () => {
      fc.assert(
        fc.property(validStudentArbitrary, (student) => {
          // Clean up before each property test iteration
          cleanup();
          
          // Render and expand the Student component
          const { container } = render(<StudentComponent student={student} />);
          const expandButton = screen.getByRole('button');
          
          // Click to expand
          expandButton.click();
          
          // Property 2.1: Expanded content should be present with correct structure
          const expandedContent = screen.getByTestId('expanded-content');
          expect(expandedContent).toBeInTheDocument();
          expect(expandedContent).toHaveClass('student-expanded-content');
          
          const additionalInfo = expandedContent.querySelector('.student-additional-info');
          expect(additionalInfo).toBeInTheDocument();
          expect(additionalInfo).toHaveClass('student-additional-info');
          
          // Property 2.2: Student ID should always be displayed in expanded view
          expect(screen.getByText('Student ID:')).toBeInTheDocument();
          expect(screen.getByText(student.id.toString())).toBeInTheDocument();
          
          // Property 2.3: Academic year should be displayed with "X of 4" format
          expect(screen.getByText('Academic Year:')).toBeInTheDocument();
          expect(screen.getByText(`${student.year} of 4`)).toBeInTheDocument();
          
          // Property 2.4: Course should be displayed with full label
          expect(screen.getByText('Course of Study:')).toBeInTheDocument();
          const courseFullText = container.textContent;
          expect(courseFullText).toContain(`Course of Study: ${student.course}`);
          
          // Property 2.5: Email should be displayed only when present
          if (student.email) {
            expect(screen.getByText('Email:')).toBeInTheDocument();
            expect(screen.getByText(student.email)).toBeInTheDocument();
          } else {
            expect(screen.queryByText('Email:')).not.toBeInTheDocument();
          }
          
          // Property 2.6: Button state should update correctly when expanded
          expect(expandButton).toHaveClass('expand-button', 'expanded');
          expect(expandButton).toHaveAttribute('aria-expanded', 'true');
          expect(expandButton).toHaveTextContent('−');
          
          const ariaLabel = expandButton.getAttribute('aria-label');
          expect(ariaLabel).toContain('Collapse details for');
          expect(ariaLabel).toContain(student.name);
        }),
        { 
          numRuns: 100,
          verbose: false,
          seed: 123 // Different seed for variety
        }
      );
    });

    test('component maintains data consistency across state changes', () => {
      fc.assert(
        fc.property(validStudentArbitrary, (student) => {
          // Clean up before each property test iteration
          cleanup();
          
          // Render the Student component
          render(<StudentComponent student={student} />);
          const expandButton = screen.getByRole('button');
          
          // Property 3.1: Initial state should display basic info consistently
          expect(screen.getByText(student.name)).toBeInTheDocument();
          expect(screen.getByText(student.course)).toBeInTheDocument();
          expect(screen.getByText(`Year ${student.year}`)).toBeInTheDocument();
          
          // Property 3.2: Data should remain consistent after expanding
          expandButton.click();
          
          // Basic info should still be visible
          expect(screen.getByText(student.name)).toBeInTheDocument();
          expect(screen.getByText(student.course)).toBeInTheDocument();
          expect(screen.getByText(`Year ${student.year}`)).toBeInTheDocument();
          
          // Additional info should now be visible
          expect(screen.getByText(student.id.toString())).toBeInTheDocument();
          expect(screen.getByText(`${student.year} of 4`)).toBeInTheDocument();
          
          // Property 3.3: Data should remain consistent after collapsing
          expandButton.click();
          
          // Basic info should still be visible
          expect(screen.getByText(student.name)).toBeInTheDocument();
          expect(screen.getByText(student.course)).toBeInTheDocument();
          expect(screen.getByText(`Year ${student.year}`)).toBeInTheDocument();
          
          // Expanded content should be hidden
          expect(screen.queryByTestId('expanded-content')).not.toBeInTheDocument();
          
          // Property 3.4: Button should return to initial state
          expect(expandButton).toHaveClass('expand-button', 'collapsed');
          expect(expandButton).toHaveAttribute('aria-expanded', 'false');
          expect(expandButton).toHaveTextContent('+');
        }),
        { 
          numRuns: 100,
          verbose: false,
          seed: 456 // Another different seed
        }
      );
    });

    test('component handles edge cases in student data gracefully', () => {
      // Generator for edge case scenarios with safer character sets
      const edgeCaseStudentArbitrary = fc.record({
        id: fc.oneof(
          fc.constant(1), // Minimum ID
          fc.constant(999999), // Maximum ID
          fc.integer({ min: 1, max: 999999 })
        ),
        name: fc.oneof(
          fc.constant('A'), // Single character name
          fc.constant('John Smith'), // Normal name
          fc.constant('Mary-Jane O\'Connor'), // Name with special chars
          fc.string({ minLength: 1, maxLength: 50 }).filter(s => /^[A-Za-z ]+$/.test(s.trim()) && s.trim().length > 0)
        ),
        course: fc.oneof(
          fc.constant('CS'), // Short course name
          fc.constant('Computer Science'), // Normal course name
          fc.constant('Advanced Theoretical Computer Science'), // Long course name
          fc.string({ minLength: 1, maxLength: 80 }).filter(s => /^[A-Za-z ]+$/.test(s.trim()) && s.trim().length > 0)
        ),
        year: fc.oneof(
          fc.constant(1), // First year
          fc.constant(4), // Final year
          fc.integer({ min: 1, max: 4 })
        ),
        email: fc.option(
          fc.oneof(
            fc.constant('test@example.com'),
            fc.constant('student@university.edu'),
            fc.constant('user@school.org')
          ),
          { nil: undefined }
        )
      });

      fc.assert(
        fc.property(edgeCaseStudentArbitrary, (student) => {
          // Clean up before each property test iteration
          cleanup();
          
          // Property 4.1: Component should render without errors for edge cases
          expect(() => {
            render(<StudentComponent student={student} />);
          }).not.toThrow();
          
          // Property 4.2: All required elements should still be present
          const studentCard = screen.getByTestId(`student-${student.id}`);
          expect(studentCard).toBeInTheDocument();
          
          const nameElement = screen.getByRole('heading', { level: 3 });
          expect(nameElement).toHaveTextContent(student.name);
          
          const courseElement = screen.getByText(student.course);
          expect(courseElement).toBeInTheDocument();
          
          const yearElement = screen.getByText(`Year ${student.year}`);
          expect(yearElement).toBeInTheDocument();
          
          const expandButton = screen.getByRole('button');
          expect(expandButton).toBeInTheDocument();
          
          // Property 4.3: Expand functionality should work for edge cases
          expandButton.click();
          
          const expandedContent = screen.getByTestId('expanded-content');
          expect(expandedContent).toBeInTheDocument();
          
          // Property 4.4: All data should be displayed correctly in expanded view
          expect(screen.getByText(student.id.toString())).toBeInTheDocument();
          expect(screen.getByText(`${student.year} of 4`)).toBeInTheDocument();
          
          if (student.email) {
            expect(screen.getByText(student.email)).toBeInTheDocument();
          }
        }),
        { 
          numRuns: 100,
          verbose: false,
          seed: 789 // Edge case specific seed
        }
      );
    });
  });
});