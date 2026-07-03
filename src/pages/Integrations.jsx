import React, { useState } from 'react';
import { 
  Twitter, 
  Linkedin, 
  Instagram, 
  Facebook, 
  Link2, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import './Integrations.css';

export default function Integrations() {
  const [connections, setConnections] = useState({
    twitter: false,
    linkedin: false,
    instagram: false,
    facebook: false
  });

  const handleConnect = (platform) => {
    // In a real app, this would redirect to an OAuth provider
    alert(`Connecting to ${platform} requires setting up Developer API keys in the backend.\n\nFor now, this button is a UI placeholder while you apply for Developer Access at ${platform}.`);
  };

  const platforms = [
    {
      id: 'twitter',
      name: 'X (Twitter)',
      icon: <Twitter size={24} color="#1DA1F2" />,
      description: 'Automatically publish threads and tweets to your X timeline.',
      connected: connections.twitter
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: <Linkedin size={24} color="#0A66C2" />,
      description: 'Share professional updates and articles to your LinkedIn network.',
      connected: connections.linkedin
    },
    {
      id: 'instagram',
      name: 'Instagram',
      icon: <Instagram size={24} color="#E1306C" />,
      description: 'Schedule reels, stories, and feed posts directly to Instagram.',
      connected: connections.instagram
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: <Facebook size={24} color="#1877F2" />,
      description: 'Cross-post your content to your Facebook Pages and Groups.',
      connected: connections.facebook
    }
  ];

  return (
    <div className="integrations-container">
      <div className="integrations-header">
        <h1>Social Integrations</h1>
        <p>Connect your social media accounts to enable AI scheduling and automatic posting.</p>
        
        <div className="integrations-alert">
          <AlertCircle size={20} color="#f59e0b" />
          <span>
            <strong>Developer Access Required:</strong> To fully connect these accounts, you must register PostPilot in each platform's Developer Portal (e.g., Meta App Dashboard, Twitter Developer). 
            Once approved, we will securely link the OAuth keys.
          </span>
        </div>
      </div>

      <div className="integrations-grid">
        {platforms.map(platform => (
          <div key={platform.id} className={`integration-card ${platform.connected ? 'connected' : ''}`}>
            <div className="integration-card-header">
              <div className="integration-icon">
                {platform.icon}
              </div>
              <div className="integration-status">
                {platform.connected ? (
                  <span className="status-badge success">
                    <CheckCircle2 size={14} /> Connected
                  </span>
                ) : (
                  <span className="status-badge pending">
                    Not Connected
                  </span>
                )}
              </div>
            </div>
            
            <h3>{platform.name}</h3>
            <p>{platform.description}</p>
            
            <button 
              className={`integration-btn ${platform.connected ? 'btn-disconnect' : 'btn-connect'}`}
              onClick={() => handleConnect(platform.name)}
            >
              {platform.connected ? 'Disconnect' : (
                <>
                  <Link2 size={16} /> Connect Account
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
