import React from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS

const NotFound: React.FC = () => {
  return (
    <div className="container text-center mt-5">
      <h1 className="display-1">404</h1>
      <p className="lead">Oops! Page not found.</p>
      <p>Sorry, the page you're looking for doesn't exist.</p>
      <a href="/" className="btn btn-primary">
        Go back to Home
      </a>
    </div>
  );
};

export default NotFound;
