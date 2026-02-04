import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from '../Header';

// Helper function to render Header with Router context
const renderHeader = () => {
  return render(
    <BrowserRouter>
      <Header />
    </BrowserRouter>
  );
};

describe('Header Component', () => {
  describe('Component Rendering', () => {
    test('renders header element with correct structure', () => {
      renderHeader();
      
      const header = screen.getByRole('banner');
      expect(header).toBeInTheDocument();
      expect(header).toHaveClass('header');
    });

    test('renders application title correctly', () => {
      renderHeader();
      
      const title = screen.getByRole('heading', { level: 1 });
      expect(title).toBeInTheDocument();
      expect(title).toHaveTextContent('Student Info App');
    });

    test('renders navigation container with proper structure', () => {
      renderHeader();
      
      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();
      expect(nav).toHaveClass('header-nav');
      
      const navList = screen.getByRole('list');
      expect(navList).toBeInTheDocument();
      expect(navList).toHaveClass('nav-list');
    });

    test('renders all required CSS classes', () => {
      renderHeader();
      
      const header = screen.getByRole('banner');
      const container = header.querySelector('.header-container');
      const brand = header.querySelector('.header-brand');
      const nav = header.querySelector('.header-nav');
      const navList = header.querySelector('.nav-list');
      
      expect(container).toBeInTheDocument();
      expect(brand).toBeInTheDocument();
      expect(nav).toBeInTheDocument();
      expect(navList).toBeInTheDocument();
    });
  });

  describe('Navigation Links', () => {
    test('renders Home navigation link with correct attributes', () => {
      renderHeader();
      
      const homeLink = screen.getByRole('link', { name: /home/i });
      expect(homeLink).toBeInTheDocument();
      expect(homeLink).toHaveAttribute('href', '/');
      expect(homeLink).toHaveClass('nav-link');
      expect(homeLink).toHaveTextContent('Home');
    });

    test('renders Students navigation link with correct attributes', () => {
      renderHeader();
      
      const studentsLink = screen.getByRole('link', { name: /students/i });
      expect(studentsLink).toBeInTheDocument();
      expect(studentsLink).toHaveAttribute('href', '/students');
      expect(studentsLink).toHaveClass('nav-link');
      expect(studentsLink).toHaveTextContent('Students');
    });

    test('renders both navigation links as list items', () => {
      renderHeader();
      
      const listItems = screen.getAllByRole('listitem');
      expect(listItems).toHaveLength(2);
      
      listItems.forEach(item => {
        expect(item).toHaveClass('nav-item');
      });
    });

    test('navigation links are properly nested within list structure', () => {
      renderHeader();
      
      const navList = screen.getByRole('list');
      const homeLink = screen.getByRole('link', { name: /home/i });
      const studentsLink = screen.getByRole('link', { name: /students/i });
      
      expect(navList).toContainElement(homeLink);
      expect(navList).toContainElement(studentsLink);
    });

    test('navigation links have correct accessibility attributes', () => {
      renderHeader();
      
      const homeLink = screen.getByRole('link', { name: /home/i });
      const studentsLink = screen.getByRole('link', { name: /students/i });
      
      // Links should be focusable
      expect(homeLink).toHaveAttribute('href');
      expect(studentsLink).toHaveAttribute('href');
      
      // Links should have meaningful text content
      expect(homeLink).toHaveAccessibleName('Home');
      expect(studentsLink).toHaveAccessibleName('Students');
    });
  });

  describe('Component Structure and Layout', () => {
    test('maintains proper semantic HTML structure', () => {
      renderHeader();
      
      // Should have proper semantic elements
      const header = screen.getByRole('banner');
      const heading = screen.getByRole('heading', { level: 1 });
      const nav = screen.getByRole('navigation');
      const list = screen.getByRole('list');
      const links = screen.getAllByRole('link');
      
      expect(header).toBeInTheDocument();
      expect(heading).toBeInTheDocument();
      expect(nav).toBeInTheDocument();
      expect(list).toBeInTheDocument();
      expect(links).toHaveLength(2);
    });

    test('header container includes both brand and navigation sections', () => {
      renderHeader();
      
      const header = screen.getByRole('banner');
      const brand = header.querySelector('.header-brand') as HTMLElement;
      const nav = header.querySelector('.header-nav') as HTMLElement;
      
      expect(brand).toBeInTheDocument();
      expect(nav).toBeInTheDocument();
      
      // Both should be children of the header container
      const container = header.querySelector('.header-container') as HTMLElement;
      expect(container).toContainElement(brand);
      expect(container).toContainElement(nav);
    });

    test('renders without any console errors', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      renderHeader();
      
      expect(consoleSpy).not.toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('Edge Cases and Error Handling', () => {
    test('component renders consistently on multiple renders', () => {
      const { unmount } = renderHeader();
      
      // First render
      expect(screen.getByRole('banner')).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Student Info App');
      
      unmount();
      
      // Second render
      renderHeader();
      expect(screen.getByRole('banner')).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Student Info App');
    });

    test('component handles missing Router context gracefully', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      // This should throw an error because Link requires Router context
      expect(() => {
        render(<Header />);
      }).toThrow();
      
      consoleSpy.mockRestore();
    });

    test('all navigation elements are present and accounted for', () => {
      renderHeader();
      
      // Verify exact count of navigation elements
      const links = screen.getAllByRole('link');
      const listItems = screen.getAllByRole('listitem');
      
      expect(links).toHaveLength(2);
      expect(listItems).toHaveLength(2);
      
      // Verify specific links exist
      expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /students/i })).toBeInTheDocument();
    });
  });

  describe('CSS Class Application', () => {
    test('applies all required CSS classes correctly', () => {
      renderHeader();
      
      const header = screen.getByRole('banner');
      const container = header.querySelector('.header-container');
      const brand = header.querySelector('.header-brand');
      const nav = header.querySelector('.header-nav');
      const navList = header.querySelector('.nav-list');
      const navItems = header.querySelectorAll('.nav-item');
      const navLinks = header.querySelectorAll('.nav-link');
      
      expect(header).toHaveClass('header');
      expect(container).toHaveClass('header-container');
      expect(brand).toHaveClass('header-brand');
      expect(nav).toHaveClass('header-nav');
      expect(navList).toHaveClass('nav-list');
      expect(navItems).toHaveLength(2);
      expect(navLinks).toHaveLength(2);
      
      navItems.forEach(item => {
        expect(item).toHaveClass('nav-item');
      });
      
      navLinks.forEach(link => {
        expect(link).toHaveClass('nav-link');
      });
    });
  });
});