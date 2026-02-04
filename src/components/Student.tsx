import React, { useState } from 'react';
import './Student.css';

// Student data interface
export interface Student {
  id: number;
  name: string;
  course: string;
  year: number;
  email?: string;
}

// Student Component Props interface
export interface StudentProps {
  student: Student;
  onExpand?: (id: number) => void;
}

const StudentComponent: React.FC<StudentProps> = ({ student, onExpand }) => {
  const [expanded, setExpanded] = useState<boolean>(false);

  const handleToggleExpand = () => {
    const newExpanded = !expanded;
    setExpanded(newExpanded);
    
    // Call optional onExpand callback if provided
    if (onExpand) {
      onExpand(student.id);
    }
  };

  return (
    <div className="student-card" data-testid={`student-${student.id}`}>
      <div className="student-header">
        <div className="student-basic-info">
          <h3 className="student-name">{student.name}</h3>
          <div className="student-details">
            <span className="student-course">{student.course}</span>
            <span className="student-year">Year {student.year}</span>
          </div>
        </div>
        <button
          className={`expand-button ${expanded ? 'expanded' : 'collapsed'}`}
          onClick={handleToggleExpand}
          aria-expanded={expanded}
          aria-label={`${expanded ? 'Collapse' : 'Expand'} details for ${student.name}`}
          type="button"
        >
          {expanded ? '−' : '+'}
        </button>
      </div>
      
      {expanded && (
        <div className="student-expanded-content" data-testid="expanded-content">
          <div className="student-additional-info">
            <p className="student-id">
              <strong>Student ID:</strong> {student.id}
            </p>
            {student.email && (
              <p className="student-email">
                <strong>Email:</strong> {student.email}
              </p>
            )}
            <p className="student-academic-info">
              <strong>Academic Year:</strong> {student.year} of 4
            </p>
            <p className="student-course-full">
              <strong>Course of Study:</strong> {student.course}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentComponent;