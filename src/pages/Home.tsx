const Home: React.FC = () => {
  return (
    <div className="home-page">
      <div className="home-container">
        <h1>Welcome to Student Info App</h1>
        <p>
          This is a modern React application demonstrating component architecture, 
          state management, client-side routing, and API integration.
        </p>
        <p>
          Navigate to the <strong>Students</strong> page to view student information 
          fetched from an external API.
        </p>
      </div>
    </div>
  );
};

export default Home;