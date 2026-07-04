import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Link2, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { FaTwitter, FaLinkedin, FaInstagram, FaFacebook, FaReddit } from 'react-icons/fa';
import { useToast } from '../context/ToastContext';
import './Integrations.css';

export default function Integrations() {
  const { addToast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [connections, setConnections] = useState(() => {
    const saved = localStorage.getItem('postpilot_connections');
    if (saved) return JSON.parse(saved);
    return {
      twitter: false,
      linkedin: false,
      reddit: false,
      instagram: false,
      facebook: false
    };
  });

  useEffect(() => {
    localStorage.setItem('postpilot_connections', JSON.stringify(connections));
  }, [connections]);

  useEffect(() => {
    const oauthSuccess = searchParams.get('oauth_success');
    const platform = searchParams.get('platform');
    const simulated = searchParams.get('simulated');
    
    if (oauthSuccess === 'true' && platform) {
      setConnections(prev => ({ ...prev, [platform]: true }));
      addToast(`Successfully connected to ${platform}! ${simulated ? '(Simulation Mode)' : ''}`, 'success');
      
      searchParams.delete('oauth_success');
      searchParams.delete('platform');
      searchParams.delete('simulated');
      setSearchParams(searchParams, { replace: true });
    } else if (oauthSuccess === 'false' && platform) {
      addToast(`Failed to connect to ${platform}.`, 'danger');
      searchParams.delete('oauth_success');
      searchParams.delete('platform');
      searchParams.delete('error');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams, addToast]);

  const handleConnect = (platformId, platformName) => {
    if (connections[platformId]) {
      // Disconnect
      setConnections(prev => ({ ...prev, [platformId]: false }));
      addToast(`Disconnected from ${platformName}`, 'info');
    } else {
      // Redirect to real OAuth flow
      window.location.href = `/api/auth/${platformId}/login`;
    }
  };

  const platforms = [
    {
      id: 'twitter',
      name: 'X (Twitter)',
      icon: <FaTwitter size={24} color="#1DA1F2" />,
      description: 'Automatically publish threads and tweets to your X timeline.',
      connected: connections.twitter
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: <FaLinkedin size={24} color="#0A66C2" />,
      description: 'Share professional updates and articles to your LinkedIn network.',
      connected: connections.linkedin
    },
    {
      id: 'reddit',
      name: 'Reddit',
      icon: <FaReddit size={24} color="#FF4500" />,
      description: 'Post to relevant subreddits and manage comments efficiently.',
      connected: connections.reddit
    },
    {
      id: 'instagram',
      name: 'Instagram',
      icon: <FaInstagram size={24} color="#E1306C" />,
      description: 'Schedule reels, stories, and feed posts directly to Instagram.',
      connected: connections.instagram
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: <FaFacebook size={24} color="#1877F2" />,
      description: 'Cross-post your content to your Facebook Pages and Groups.',
      connected: connections.facebook
    }
  ];

  return (
    <div className="integrations-container">
      <div className="integrations-header">
        <h1>Social Integrations</h1>
        <p>Connect your social media accounts to enable AI scheduling and automatic posting.</p>
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
              onClick={() => handleConnect(platform.id, platform.name)}
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
