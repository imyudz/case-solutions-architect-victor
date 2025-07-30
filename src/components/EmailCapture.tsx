import React, { useState } from 'react';
import { useAnalytics } from '../hooks/useAnalytics';

interface EmailCaptureProps {
  houseName?: string;
  houseId?: string;
  className?: string;
}

export function EmailCapture({ houseName, houseId, className = '' }: EmailCaptureProps) {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { identifyUser, trackEvent, trackButtonClick } = useAnalytics();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || isLoading) return;
    
    setIsLoading(true);
    
    try {
      trackEvent('EmailCaptureAttempted', {
        house_name: houseName,
        house_id: houseId,
        email_domain: email.split('@')[1] || 'unknown'
      });

      await new Promise(resolve => setTimeout(resolve, 800));
      
      const userId = email.toLowerCase().trim();
      
      identifyUser(userId, {
        email: email.toLowerCase().trim(),
        favorite_house: houseName,
        favorite_house_id: houseId,
        identification_method: 'email_capture',
        identified_at: new Date().toISOString(),
        user_type: 'house_enthusiast'
      });

      trackEvent('UserIdentified', {
        identification_method: 'email_capture',
        house_name: houseName,
        house_id: houseId,
        user_id: userId
      });

      setIsSubmitted(true);
    } catch (error) {
      console.error('Error identifying user:', error);
      
      trackEvent('EmailCaptureError', {
        house_name: houseName,
        house_id: houseId,
        error_message: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleFocusEmail = () => {
    trackEvent('EmailFieldFocused', {
      house_name: houseName,
      house_id: houseId
    });
  };

  if (isSubmitted) {
    return (
      <section className={`glass rounded-magical p-8 shadow-glass text-center ${className}`}>
        <div className="text-6xl mb-4 animate-bounce">✨</div>
        <h3 className="text-2xl font-bold text-white mb-4">
          Welcome to {houseName}!
        </h3>
        <p className="text-white/80 mb-6">
          You are now connected to your house! We've identified you as a {houseName} enthusiast.
          Your magical journey continues with personalized insights.
        </p>
        <div className="bg-green-500/20 border border-green-400/30 rounded-lg p-4">
          <p className="text-green-200 text-sm">
            🎯 <strong>Analytics Demo:</strong> You just transitioned from an anonymous user to a known user! 
            Check the Amplitude dashboard to see how your events are now linked to your identity.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className={`glass rounded-magical p-8 shadow-glass ${className}`}>
      <div className="text-center mb-8">
        <div className="text-5xl mb-4">🦉</div>
        <h3 className="text-2xl font-bold text-white mb-2">
          Join {houseName || 'Your House'}!
        </h3>
        <p className="text-white/80">
          Receive magical updates and exclusive content about {houseName || 'your favorite house'}.
          Be the first to know about house events and news!
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
        <div>
          <label htmlFor="email" className="block text-white/90 font-medium mb-2">
            Your Owl Post Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={handleEmailChange}
            onFocus={handleFocusEmail}
            placeholder="your.owl@hogwarts.edu"
            required
            disabled={isLoading}
            className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm 
                     border border-white/20 text-white placeholder-white/50
                     focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all duration-300"
          />
        </div>

        <button
          type="submit"
          disabled={!email.trim() || isLoading}
          onClick={() => trackButtonClick('email_capture_submit', `Submit - ${houseName}`)}
          className="w-full btn-magical btn-primary text-lg py-3 px-6
                   disabled:opacity-50 disabled:cursor-not-allowed
                   flex items-center justify-center gap-2
                   hover:shadow-xl transition-all duration-300"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              Sending Owl...
            </>
          ) : (
            <>
              Join {houseName}
            </>
          )}
        </button>
      </form>
    </section>
  );
} 