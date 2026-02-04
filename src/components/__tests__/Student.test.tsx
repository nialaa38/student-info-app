import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import StudentComponent, { type Student, type StudentProps } from '../Student';

// Clean up after each test
afterEach(cleanup);

// Mock student data for testing
const mockStudent: Student = {
  id: 1,
  name: 'John Doe',
  course: 'Computer Science',
  year: 3,
  email: 'john.doe@example.com'
};

const mockStudentWithoutEmail: Student = {
  id: 2,
  name: 'Jane Smith',
  course: 'Mathematics',
  year: 2
};

// Helper function to render Student component
const renderStudent = (props: Partial<StudentProps> = {}) => {
  const defaultProps: StudentProps = {
    student: mockStudent,
    ...props
  };
  
  return render(<StudentComponent {...defaultProps} />);
};

describe('Student Component', () => {
  describe('Component Rendering', () => {
    test('renders student card with correct structure', () => {
      renderStudent();
      
      const studentCard = screen.getByTestId('student-1');
      expect(studentCard).toBeInTheDocument();
      expect(studentCard).toHaveClass('student-card');
    });

    test('renders student name correctly', () => {
      renderStudent();
      
      const studentName = screen.getByRole('heading', { level: 3 });
      expect(studentName).toBeInTheDocument();
      expect(studentName).toHaveTextContent('John Doe');
      expect(studentName).toHaveClass('student-name');
    });

    test('renders student course and year information', () => {
      renderStudent();
      
      const course = screen.getByText('Computer Science');
      const year = screen.getByText('Year 3');
      
      expect(course).toBeInTheDocument();
      expect(course).toHaveClass('student-course');
      expect(year).toBeInTheDocument();
      expect(year).toHaveClass('student-year');
    });

    test('renders expand/collapse button with correct initial state', () => {
      renderStudent();
      
      const expandButton = screen.getByRole('button');
      expect(expandButton).toBeInTheDocument();
      expect(expandButton).toHaveClass('expand-button', 'collapsed');
      expect(expandButton).toHaveAttribute('aria-expanded', 'false');
      expect(expandButton).toHaveAttribute('aria-label', 'Expand details for John Doe');
      expect(expandButton).toHaveTextContent('+');
    });

    test('renders all required CSS classes', () => {
      renderStudent();
      
      const studentCard = screen.getByTestId('student-1');
      const header = studentCard.querySelector('.student-header');
      const basicInfo = studentCard.querySelector('.student-basic-info');
      const details = studentCard.querySelector('.student-details');
      
      expect(header).toBeInTheDocument();
      expect(basicInfo).toBeInTheDocument();
      expect(details).toBeInTheDocument();
    });
  });

  describe('Expand/Collapse Functionality', () => {
    test('expands content when expand button is clicked', () => {
      renderStudent();
      
      const expandButton = screen.getByRole('button');
      
      // Initially collapsed
      expect(screen.queryByTestId('expanded-content')).not.toBeInTheDocument();
      
      // Click to expand
      fireEvent.click(expandButton);
      
      // Should be expanded
      expect(screen.getByTestId('expanded-content')).toBeInTheDocument();
      expect(expandButton).toHaveClass('expand-button', 'expanded');
      expect(expandButton).toHaveAttribute('aria-expanded', 'true');
      expect(expandButton).toHaveAttribute('aria-label', 'Collapse details for John Doe');
      expect(expandButton).toHaveTextContent('−');
    });

    test('collapses content when expand button is clicked again', () => {
      renderStudent();
      
      const expandButton = screen.getByRole('button');
      
      // Expand first
      fireEvent.click(expandButton);
      expect(screen.getByTestId('expanded-content')).toBeInTheDocument();
      
      // Collapse
      fireEvent.click(expandButton);
      expect(screen.queryByTestId('expanded-content')).not.toBeInTheDocument();
      expect(expandButton).toHaveClass('expand-button', 'collapsed');
      expect(expandButton).toHaveAttribute('aria-expanded', 'false');
      expect(expandButton).toHaveAttribute('aria-label', 'Expand details for John Doe');
      expect(expandButton).toHaveTextContent('+');
    });

    test('calls onExpand callback when provided', () => {
      const mockOnExpand = jest.fn();
      renderStudent({ onExpand: mockOnExpand });
      
      const expandButton = screen.getByRole('button');
      
      // Click to expand
      fireEvent.click(expandButton);
      
      expect(mockOnExpand).toHaveBeenCalledTimes(1);
      expect(mockOnExpand).toHaveBeenCalledWith(1);
      
      // Click to collapse
      fireEvent.click(expandButton);
      
      expect(mockOnExpand).toHaveBeenCalledTimes(2);
      expect(mockOnExpand).toHaveBeenCalledWith(1);
    });

    test('works without onExpand callback', () => {
      renderStudent({ onExpand: undefined });
      
      const expandButton = screen.getByRole('button');
      
      // Should not throw error when clicking without callback
      expect(() => {
        fireEvent.click(expandButton);
      }).not.toThrow();
      
      expect(screen.getByTestId('expanded-content')).toBeInTheDocument();
    });
  });

  describe('Expanded Content Display', () => {
    test('displays all student information when expanded', () => {
      renderStudent();
      
      const expandButton = screen.getByRole('button');
      fireEvent.click(expandButton);
      
      const expandedContent = screen.getByTestId('expanded-content');
      expect(expandedContent).toBeInTheDocument();
      
      // Check for student ID
      expect(screen.getByText('Student ID:')).toBeInTheDocument();
      expect(screen.getByText('1')).toBeInTheDocument();
      
      // Check for email
      expect(screen.getByText('Email:')).toBeInTheDocument();
      expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();
      
      // Check for academic year
      expect(screen.getByText('Academic Year:')).toBeInTheDocument();
      expect(screen.getByText('3 of 4')).toBeInTheDocument();
      
      // Check for course of study
      expect(screen.getByText('Course of Study:')).toBeInTheDocument();
      const courseFullElement = screen.getByTestId('expanded-content');
      expect(courseFullElement).toHaveTextContent('Course of Study: Computer Science');
    });

    test('handles student without email gracefully', () => {
      renderStudent({ student: mockStudentWithoutEmail });
      
      const expandButton = screen.getByRole('button');
      fireEvent.click(expandButton);
      
      // Email section should not be present
      expect(screen.queryByText('Email:')).not.toBeInTheDocument();
      
      // Other information should still be present
      expect(screen.getByText('Student ID:')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('Academic Year:')).toBeInTheDocument();
      expect(screen.getByText('2 of 4')).toBeInTheDocument();
    });

    test('applies correct CSS classes to expanded content', () => {
      renderStudent();
      
      const expandButton = screen.getByRole('button');
      fireEvent.click(expandButton);
      
      const expandedContent = screen.getByTestId('expanded-content');
      const additionalInfo = expandedContent.querySelector('.student-additional-info');
      
      expect(expandedContent).toHaveClass('student-expanded-content');
      expect(additionalInfo).toBeInTheDocument();
      expect(additionalInfo).toHaveClass('student-additional-info');
    });
  });

  describe('Prop Handling and Validation', () => {
    test('handles different student data correctly', () => {
      const differentStudent: Student = {
        id: 99,
        name: 'Alice Johnson',
        course: 'Physics',
        year: 4,
        email: 'alice@university.edu'
      };
      
      renderStudent({ student: differentStudent });
      
      expect(screen.getByTestId('student-99')).toBeInTheDocument();
      expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
      expect(screen.getByText('Physics')).toBeInTheDocument();
      expect(screen.getByText('Year 4')).toBeInTheDocument();
      
      // Expand to check email
      const expandButton = screen.getByRole('button');
      fireEvent.click(expandButton);
      
      expect(screen.getByText('alice@university.edu')).toBeInTheDocument();
    });

    test('handles edge case year values', () => {
      const firstYearStudent: Student = {
        id: 100,
        name: 'Bob Wilson',
        course: 'Engineering',
        year: 1
      };
      
      renderStudent({ student: firstYearStudent });
      
      expect(screen.getByText('Year 1')).toBeInTheDocument();
      
      // Expand to check academic year display
      const expandButton = screen.getByRole('button');
      fireEvent.click(expandButton);
      
      expect(screen.getByText('1 of 4')).toBeInTheDocument();
    });

    test('handles long names and course titles', () => {
      const longNameStudent: Student = {
        id: 101,
        name: 'Christopher Alexander Montgomery-Smith',
        course: 'Advanced Theoretical Computer Science and Mathematics',
        year: 2
      };
      
      renderStudent({ student: longNameStudent });
      
      expect(screen.getByText('Christopher Alexander Montgomery-Smith')).toBeInTheDocument();
      expect(screen.getByText('Advanced Theoretical Computer Science and Mathematics')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    test('expand button has proper accessibility attributes', () => {
      renderStudent();
      
      const expandButton = screen.getByRole('button');
      
      expect(expandButton).toHaveAttribute('type', 'button');
      expect(expandButton).toHaveAttribute('aria-expanded', 'false');
      expect(expandButton).toHaveAttribute('aria-label');
      
      // After expanding
      fireEvent.click(expandButton);
      expect(expandButton).toHaveAttribute('aria-expanded', 'true');
    });

    test('aria-label updates correctly based on state', () => {
      renderStudent();
      
      const expandButton = screen.getByRole('button');
      
      expect(expandButton).toHaveAttribute('aria-label', 'Expand details for John Doe');
      
      fireEvent.click(expandButton);
      expect(expandButton).toHaveAttribute('aria-label', 'Collapse details for John Doe');
      
      fireEvent.click(expandButton);
      expect(expandButton).toHaveAttribute('aria-label', 'Expand details for John Doe');
    });

    test('component maintains semantic HTML structure', () => {
      renderStudent();
      
      // Should have proper heading
      const heading = screen.getByRole('heading', { level: 3 });
      expect(heading).toBeInTheDocument();
      
      // Should have proper button
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      
      // Expand to check additional content structure
      fireEvent.click(button);
      
      const expandedContent = screen.getByTestId('expanded-content');
      expect(expandedContent).toBeInTheDocument();
    });
  });

  describe('Edge Cases and Error Handling', () => {
    test('renders without console errors', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      renderStudent();
      
      expect(consoleSpy).not.toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    test('handles multiple rapid clicks on expand button', () => {
      renderStudent();
      
      const expandButton = screen.getByRole('button');
      
      // Rapid clicks
      fireEvent.click(expandButton);
      fireEvent.click(expandButton);
      fireEvent.click(expandButton);
      fireEvent.click(expandButton);
      
      // Should end up collapsed (even number of clicks)
      expect(screen.queryByTestId('expanded-content')).not.toBeInTheDocument();
      expect(expandButton).toHaveClass('collapsed');
    });

    test('component re-renders correctly with different props', () => {
      const { rerender } = renderStudent();
      
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      
      // Re-render with different student
      rerender(<StudentComponent student={mockStudentWithoutEmail} />);
      
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
    });

    test('maintains state independence between multiple instances', () => {
      render(
        <div>
          <StudentComponent student={mockStudent} />
          <StudentComponent student={mockStudentWithoutEmail} />
        </div>
      );
      
      const expandButtons = screen.getAllByRole('button');
      expect(expandButtons).toHaveLength(2);
      
      // Expand first student
      fireEvent.click(expandButtons[0]);
      
      // Only first student should be expanded
      expect(screen.getByTestId('student-1').querySelector('[data-testid="expanded-content"]')).toBeInTheDocument();
      expect(screen.getByTestId('student-2').querySelector('[data-testid="expanded-content"]')).not.toBeInTheDocument();
    });
  });

  describe('Component Integration', () => {
    test('integrates properly with parent components', () => {
      const mockOnExpand = jest.fn();
      
      const ParentComponent = () => (
        <div data-testid="parent">
          <StudentComponent student={mockStudent} onExpand={mockOnExpand} />
        </div>
      );
      
      render(<ParentComponent />);
      
      const parent = screen.getByTestId('parent');
      const studentCard = screen.getByTestId('student-1');
      
      expect(parent).toContainElement(studentCard);
      
      // Test callback integration
      const expandButton = screen.getByRole('button');
      fireEvent.click(expandButton);
      
      expect(mockOnExpand).toHaveBeenCalledWith(1);
    });

    test('works correctly in list contexts', () => {
      const students = [mockStudent, mockStudentWithoutEmail];
      
      const StudentList = () => (
        <div data-testid="student-list">
          {students.map(student => (
            <StudentComponent key={student.id} student={student} />
          ))}
        </div>
      );
      
      render(<StudentList />);
      
      const list = screen.getByTestId('student-list');
      
      // Check that both students are rendered
      expect(screen.getByTestId('student-1')).toBeInTheDocument();
      expect(screen.getByTestId('student-2')).toBeInTheDocument();
      
      // Check that the list contains the student elements
      expect(list).toContainElement(screen.getByTestId('student-1'));
      expect(list).toContainElement(screen.getByTestId('student-2'));
    });
  });
});