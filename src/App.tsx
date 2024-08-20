import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import eaglesLogo from './images/eagles.png';

const NFL_THEME = 'https://www.televisiontunes.com/uploads/audio/NFL on FOX - Version 2.mp3';

interface Team {
  name: string;
  ballots: number;
}

const App: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [newTeam, setNewTeam] = useState('');
  const [newBallots, setNewBallots] = useState(1);
  const [draftOrder, setDraftOrder] = useState<string[]>([]);
  const [currentReveal, setCurrentReveal] = useState(-1);
  const [isDraftComplete, setIsDraftComplete] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isWeightedMode, setIsWeightedMode] = useState(false);
  const [audio] = useState(new Audio(NFL_THEME));

  useEffect(() => {
    document.title = "Hammer's Fantasy Draft Lottery";
    const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
    if (link) {
      link.href = '/images/favicon.ico';
    }
    return () => {
      audio.pause();
    };
  }, [audio]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && currentReveal < draftOrder.length - 1) {
      interval = setInterval(() => {
        setCurrentReveal(prev => prev + 1);
      }, 10000);
    } else if (currentReveal === draftOrder.length - 1) {
      setIsDraftComplete(true);
      setIsPlaying(false);
      audio.pause();
      confetti({
        particleCount: 300,
        spread: 180,
        origin: { y: 0.6 }
      });
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentReveal, draftOrder.length, audio]);

  const addTeam = () => {
    if (newTeam && !teams.some(team => team.name === newTeam)) {
      setTeams([...teams, { name: newTeam, ballots: newBallots }]);
      setNewTeam('');
      setNewBallots(1);
    }
  };

  const removeTeam = (teamToRemove: string) => {
    setTeams(teams.filter(team => team.name !== teamToRemove));
  };

  const superRandomDraftOrder = (teams: Team[]): string[] => {
    let ballots: string[] = [];
    teams.forEach(team => {
      for (let i = 0; i < team.ballots; i++) {
        ballots.push(team.name);
      }
    });
    
    for (let i = ballots.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [ballots[i], ballots[j]] = [ballots[j], ballots[i]];
    }
    
    return Array.from(new Set(ballots)).reverse();
  };

  const startDraft = () => {
    const randomizedOrder = superRandomDraftOrder(teams);
    setDraftOrder(randomizedOrder);
    setCurrentReveal(0);
    setIsDraftComplete(false);
    setIsPlaying(true);
    audio.play();
  };

  const resetDraft = () => {
    setDraftOrder([]);
    setCurrentReveal(-1);
    setIsDraftComplete(false);
    setIsPlaying(false);
    audio.pause();
    audio.currentTime = 0;
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      background: 'linear-gradient(to bottom, #1a2a6c, #2a4858)',
      color: 'white',
      padding: '2rem',
      fontFamily: 'Arial, sans-serif',
      boxSizing: 'border-box',
      overflow: 'auto'
    }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '2rem', textAlign: 'center' }}>
        Hammer's Fantasy Draft Lottery
      </h1>
      
      <img src={eaglesLogo} alt="Eagles Logo" style={{ width: '120px', margin: '0 auto 2rem', display: 'block' }} />
      
      {!isPlaying && (
        <div style={{ background: 'rgba(255,255,255,0.1)', padding: '2rem', borderRadius: '8px', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Enter Teams</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1rem' }}>
            <input
              type="text"
              value={newTeam}
              onChange={(e) => setNewTeam(e.target.value)}
              placeholder="Enter team name"
              style={{ 
                padding: '0.75rem', 
                borderRadius: '4px', 
                border: 'none',
                color: 'black',
                fontSize: '1rem'
              }}
            />
            {isWeightedMode && (
              <input
                type="number"
                value={newBallots}
                onChange={(e) => setNewBallots(Math.max(1, parseInt(e.target.value)))}
                min="1"
                placeholder="Number of ballots"
                style={{ 
                  padding: '0.75rem', 
                  borderRadius: '4px', 
                  border: 'none',
                  color: 'black',
                  fontSize: '1rem'
                }}
              />
            )}
            <button onClick={addTeam} style={{ padding: '0.75rem', borderRadius: '4px', border: 'none', background: '#4CAF50', color: 'white', cursor: 'pointer', fontSize: '1rem' }}>
              Add Team
            </button>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', fontSize: '1rem' }}>
              <input
                type="checkbox"
                checked={isWeightedMode}
                onChange={(e) => setIsWeightedMode(e.target.checked)}
                style={{ marginRight: '0.5rem' }}
              />
              Weighted Mode
            </label>
          </div>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {teams.map((team, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', fontSize: '1rem' }}
              >
                <span>{team.name} {isWeightedMode && `(${team.ballots} ballots)`}</span>
                <button onClick={() => removeTeam(team.name)} style={{ background: '#f44336', color: 'white', border: 'none', borderRadius: '4px', padding: '0.5rem 0.75rem', cursor: 'pointer' }}>
                  Remove
                </button>
              </motion.li>
            ))}
          </ul>
        </div>
      )}
      
      {!isPlaying && teams.length > 1 && (
        <div style={{ textAlign: 'center' }}>
          <motion.button
            onClick={startDraft}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{ padding: '1rem 2rem', fontSize: '1.2rem', borderRadius: '4px', border: 'none', background: '#4CAF50', color: 'white', cursor: 'pointer' }}
          >
            Start Draft
          </motion.button>
        </div>
      )}
      
      {isPlaying && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
        >
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem', textAlign: 'center' }}>Draft Order</h2>
          <div style={{ display: 'flex', flexDirection: 'column-reverse', gap: '1rem' }}>
            <AnimatePresence>
              {draftOrder.slice(0, currentReveal + 1).map((team, index) => (
                <motion.div
                  key={team}
                  initial={{ opacity: 0, y: -50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 50 }}
                  transition={{ duration: 0.5 }}
                  style={{ 
                    background: index === 0 ? 'linear-gradient(45deg, #FFD700, #FFA500)' : 'rgba(255,255,255,0.2)', 
                    padding: '1.5rem', 
                    borderRadius: '8px',
                    textAlign: 'center'
                  }}
                >
                  <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Pick #{draftOrder.length - index}</p>
                  <p style={{ fontSize: '2rem' }}>{team}</p>
                  {index === 0 && currentReveal === draftOrder.length - 1 && (
                    <p style={{ fontSize: '1.2rem', marginTop: '0.5rem' }}>🏆 First Overall Pick! 🏆</p>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
      
      {isDraftComplete && (
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>Final Draft Order</h2>
          <ol style={{ listStyle: 'none', padding: 0 }}>
            {draftOrder.map((team, index) => (
              <li key={index} style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>
                {index + 1}. {team}
              </li>
            ))}
          </ol>
          <motion.button
            onClick={resetDraft}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{ padding: '1rem 2rem', fontSize: '1.2rem', borderRadius: '4px', border: 'none', background: '#9C27B0', color: 'white', cursor: 'pointer', marginTop: '2rem' }}
          >
            Reset Draft
          </motion.button>
        </div>
      )}
    </div>
  );
};

export default App;