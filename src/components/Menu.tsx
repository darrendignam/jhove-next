import React from "react";

interface MenuProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export default function Menu({ activeSection, setActiveSection }: MenuProps) {
  return (
    <nav className="menu">
      <div
        className={`menu-item ${activeSection === "Home" ? "bg-opf-purple" : ""}`}
        onClick={() => setActiveSection("Home")}
      >
        <span>🏠</span> <span>Home</span>
      </div>
      <div
        className={`menu-item ${activeSection === "Analyse" ? "bg-opf-purple" : ""}`}
        onClick={() => setActiveSection("Analyse")}
      >
        <span>📊</span> <span>Analyse</span>
      </div>
      <div
        className={`menu-item ${activeSection === "About" ? "bg-opf-purple" : ""}`}
        onClick={() => setActiveSection("About")}
      >
        <span>ℹ️</span> <span>About</span>
      </div>
    </nav>
  );
}