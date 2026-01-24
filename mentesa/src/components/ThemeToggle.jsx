import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import './ThemeToggle.css';

export default function ThemeToggle() {
  const [isOpen, setIsOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <>
      {/* Floating Button */}
      <button 
        className="theme-float-btn"
        onClick={() => setIsOpen(true)}
        title="Configurações de Tema"
      >
        🎨
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="theme-modal-overlay" onClick={() => setIsOpen(false)}>
          <div className="theme-modal" onClick={(e) => e.stopPropagation()}>
            <div className="theme-modal-header">
              <h3>Configurações de Tema</h3>
              <button className="theme-modal-close" onClick={() => setIsOpen(false)}>✕</button>
            </div>
            <div className="theme-modal-body">
              <div className="theme-option">
                <span>{isDarkMode ? '🌙 Tema Escuro' : '☀️ Tema Claro'}</span>
                <label className="theme-switch">
                  <input 
                    type="checkbox" 
                    checked={isDarkMode}
                    onChange={toggleTheme}
                  />
                  <span className="theme-slider"></span>
                </label>
              </div>
              <p className="theme-description">
                {isDarkMode 
                  ? 'O tema escuro reduz o brilho da tela e ajuda a descansar os olhos.'
                  : 'O tema claro oferece melhor legibilidade em ambientes bem iluminados.'}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
