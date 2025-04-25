import React from 'react';
import '../components/styles.css';

const Header = ({ onSearch, onAddAlbum }) => {
  return (
    <div className="header">
      <div className="logo">Music Collection</div>
      <div className="search-container">
        <input 
          type="text" 
          className="search-input" 
          placeholder="Search albums..." 
          onChange={(e) => onSearch(e.target.value)}
        />
        <span className="search-icon">🔍</span>
      </div>
      <button className="new-album-btn" onClick={onAddAlbum}>
        New Album
      </button>
    </div>
  );
};

export default Header;