"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from '../page.module.css';

const UNLOCK_DATE = new Date('2025-09-08T00:00:00+08:00'); // Manila time (for testing unlock)

function getCountdownParts(target: Date, now: Date) {
  let diff = Math.max(0, target.getTime() - now.getTime());
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  diff -= days * (1000 * 60 * 60 * 24);
  const hours = Math.floor(diff / (1000 * 60 * 60));
  diff -= hours * (1000 * 60 * 60);
  const minutes = Math.floor(diff / (1000 * 60));
  diff -= minutes * (1000 * 60);
  const seconds = Math.floor(diff / 1000);
  return { days, hours, minutes, seconds };
}

const fontStyle = {
  fontFamily: 'Montserrat, "Segoe UI", Arial, sans-serif',
};
const pixelFontStyle = {
  fontFamily: '"Press Start 2P", monospace',
  letterSpacing: 1.2,
};

export default function SecretPage() {
  const [now, setNow] = useState<Date | null>(null);
  const [error, setError] = useState("");
  const [showLoader, setShowLoader] = useState(true);
  const [loadingDotCount, setLoadingDotCount] = useState(0);
  const [opening, setOpening] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showContinue, setShowContinue] = useState(false);
  const [showLetterPage, setShowLetterPage] = useState(false);
  const [letterPage, setLetterPage] = useState(1);

  // Animate loading dots
  useEffect(() => {
    if (!showLoader) return;
    const dotTimer = setInterval(() => {
      setLoadingDotCount(c => (c + 1) % 4);
    }, 400);
    return () => clearInterval(dotTimer);
  }, [showLoader]);

  // Show loader for 2 seconds before fetching time
  useEffect(() => {
    const timer = setTimeout(() => setShowLoader(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Fetch internet time after loader
  useEffect(() => {
    if (showLoader) return;
    fetch('https://timeapi.io/api/Time/current/zone?timeZone=Asia/Manila')
      .then(res => res.json())
      .then(data => {
        setNow(new Date(data.dateTime));
      })
      .catch(() => setError("Failed to fetch internet time. Please check your connection."));
  }, [showLoader]);

  // Update countdown every second if locked
  useEffect(() => {
    if (!now) return;
    if (now >= UNLOCK_DATE) return;
    const interval = setInterval(() => {
      setNow(prev => prev ? new Date(prev.getTime() + 1000) : null);
    }, 1000);
    return () => clearInterval(interval);
  }, [now]);

  // Format unlock date for display, replacing 'at' with '@'
  let unlockDateString = UNLOCK_DATE.toLocaleString('en-PH', {
    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'Asia/Manila'
  });
  unlockDateString = unlockDateString.replace(' at ', ' @ ');

  const isUnlocked = now ? now >= UNLOCK_DATE : false;
  const countdown = now && !isUnlocked ? getCountdownParts(UNLOCK_DATE, now) : null;

  function handleOpenClick() {
    setOpening(true);
    setShowConfetti(true);
    setShowContinue(false);
    setTimeout(() => setShowConfetti(false), 6000);
    setTimeout(() => setShowContinue(true), 6000);
  }

  function handleContinueClick() {
    setShowLetterPage(true);
    setLetterPage(1);
  }

  return (
    <div className={styles.pixelBg}>
      {showLoader && !error ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 60, minWidth: 180, padding: '32px 36px', background: 'rgba(255,255,255,0.96)', borderRadius: 18, boxShadow: '0 4px 24px #a67c5233', border: '2px solid #e2c7b7', margin: '0 auto' }}>
          <div style={{
            fontFamily: '"Press Start 2P", monospace',
            color: '#a67c52',
            fontSize: 32,
            letterSpacing: 2,
            textAlign: 'center',
            fontWeight: 900,
            userSelect: 'none',
            whiteSpace: 'nowrap',
          }}>
            Loading{'.'.repeat(loadingDotCount)}
          </div>
        </div>
      ) : showLetterPage ? (
        <div className={styles.pixelBrowserWindow + ' ' + styles.secretLetter}>
          <div className={styles.pixelBrowserHeader}>
            <div className={styles.pixelBrowserControls}>
              <span className={styles.pixelControlBtn + ' ' + styles.min} title="Minimize">
                <svg className={styles.pixelControlBtnIcon} viewBox="0 0 10 10"><rect x="2" y="7" width="6" height="2" fill="#a67c52"/></svg>
              </span>
              <span className={styles.pixelControlBtn + ' ' + styles.full} title="Fullscreen">
                <svg className={styles.pixelControlBtnIcon} viewBox="0 0 10 10"><rect x="2" y="2" width="6" height="6" fill="#a67c52"/></svg>
              </span>
              <span className={styles.pixelControlBtn + ' ' + styles.close} title="Close">
                <svg className={styles.pixelControlBtnIcon} viewBox="0 0 10 10"><line x1="2" y1="2" x2="8" y2="8" stroke="#a67c52" strokeWidth="2"/><line x1="8" y1="2" x2="2" y2="8" stroke="#a67c52" strokeWidth="2"/></svg>
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 320, padding: 24 }}>
            {letterPage === 1 && (
              <>
                <div style={{
                  fontFamily: 'VT323, Fira Mono, monospace',
                  color: '#845954',
                  fontSize: 13,
                  background: '#fff8f0',
                  border: '2px dashed #d9b99b',
                  borderRadius: 10,
                  padding: '18px 24px',
                  width: 600,
                  maxWidth: '99vw',
                  maxHeight: 520,
                  margin: '24px auto 40px auto',
                  textAlign: 'center',
                  boxShadow: '0 2px 8px #a67c5222',
                  whiteSpace: 'pre-line',
                  overflowY: 'auto',
                  lineHeight: 1.7,
                  letterSpacing: 1.1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                }}>
                  Soafer Happiest Birthday litol beabadoobee, grabe 22 ka na ate eme, so ayon nga i just wanna say happy birthday and wish you all the best, i know we are no longer together anymore pero that doesn&apos;t mean i don&apos;t get to greet you on ur special day, u still hold a special in my heart nohhh baka magalit :P, i just really hope that you are doing fine and having a proper body clock by now at alam kong napapadalas na ung puyat,  diba u want to fix it like u said before, ngl i do kinda miss you anong kinda SOAFER actually, kamusta ka na? wala na me balita sayo but i keep supporting u from afar and will never stop caring even the world is hard on you, at don&apos;t be hard on urself ahh, alagaan mo always sarili mo. alam kong maalat lover ka eh. sana makatikim ng graham at dalgona coffee mo haist. sorry by the time its ur day i wont get to send u a tulip but let&apos;s see, dami kong sinabi noh TwT. pero ayon happy birthday ulit and coffee soon eme. the future doctor yarn HAHAHAHAHAHAHA, dont forget to put a smile on ur face cuz it really fits you!! you are appreciated and im always proud of you!!
                </div>
                <Link href="/" className={styles.openButton} style={{ margin: '48px auto 64px auto', minWidth: 90 }}>Finish</Link>
              </>
            )}
          </div>
        </div>
      ) : opening || showConfetti || showContinue ? (
        <div className={styles.pixelBrowserWindow}>
          <div className={styles.pixelBrowserHeader}>
            <div className={styles.pixelBrowserControls}>
              <span className={styles.pixelControlBtn + ' ' + styles.min} title="Minimize">
                <svg className={styles.pixelControlBtnIcon} viewBox="0 0 10 10"><rect x="2" y="7" width="6" height="2" fill="#a67c52"/></svg>
              </span>
              <span className={styles.pixelControlBtn + ' ' + styles.full} title="Fullscreen">
                <svg className={styles.pixelControlBtnIcon} viewBox="0 0 10 10"><rect x="2" y="2" width="6" height="6" fill="#a67c52"/></svg>
              </span>
              <span className={styles.pixelControlBtn + ' ' + styles.close} title="Close">
                <svg className={styles.pixelControlBtnIcon} viewBox="0 0 10 10"><line x1="2" y1="2" x2="8" y2="8" stroke="#a67c52" strokeWidth="2"/><line x1="8" y1="2" x2="2" y2="8" stroke="#a67c52" strokeWidth="2"/></svg>
              </span>
            </div>
          </div>
          <div style={{ width: '100%', minHeight: 180, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: 18 }}>
            {/* PNG burst rows */}
            {showConfetti && (
              <>
                <div className={styles.birthdayBurstRow}>
                  {['h','a','p','p','y'].map((l, i) => (
                    <img key={i} src={`/${l}.png`} alt={l} className={styles.birthdayLetter + ' ' + styles[`delay-${i}`]} width={32} height={32} />
                  ))}
                </div>
                <div className={styles.birthdayBurstRow}>
                  {['b','i','r','t','h','d','a','y'].map((l, i) => (
                    <img key={i} src={`/${l}.png`} alt={l} className={styles.birthdayLetter + ' ' + styles[`delay-${i+5}`]} width={32} height={32} />
                  ))}
                </div>
                <div className={styles.birthdayBurstRow}>
                  {['g','e','l','i','exclamation'].map((l, i) => (
                    <img key={i} src={`/${l}.png`} alt={l} className={styles.birthdayLetter + ' ' + styles[`delay-${i+13}`]} width={32} height={32} />
                  ))}
                </div>
              </>
            )}
            {showContinue && (
              <button
                className={styles.openButton + ' ' + styles.fadePopIn}
                style={{ margin: '32px auto 0 auto' }}
                onClick={handleContinueClick}
              >
                CONTINUE
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className={styles.pixelBrowserWindow}>
          <div className={styles.pixelBrowserHeader}>
            <div className={styles.pixelBrowserControls}>
              <span className={styles.pixelControlBtn + ' ' + styles.min} title="Minimize">
                <svg className={styles.pixelControlBtnIcon} viewBox="0 0 10 10"><rect x="2" y="7" width="6" height="2" fill="#a67c52"/></svg>
              </span>
              <span className={styles.pixelControlBtn + ' ' + styles.full} title="Fullscreen">
                <svg className={styles.pixelControlBtnIcon} viewBox="0 0 10 10"><rect x="2" y="2" width="6" height="6" fill="#a67c52"/></svg>
              </span>
              <span className={styles.pixelControlBtn + ' ' + styles.close} title="Close">
                <svg className={styles.pixelControlBtnIcon} viewBox="0 0 10 10"><line x1="2" y1="2" x2="8" y2="8" stroke="#a67c52" strokeWidth="2"/><line x1="8" y1="2" x2="2" y2="8" stroke="#a67c52" strokeWidth="2"/></svg>
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 320, padding: 24 }}>
            {error && (
              <div style={{ ...fontStyle, color: 'red', textAlign: 'center', fontSize: 16 }}>{error}</div>
            )}
            {/* Locked state content */}
            <div style={{
              width: 60,
              height: 60,
              background: 'linear-gradient(135deg, #f7e6d7 60%, #e2c7b7 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 12,
              boxShadow: '0 2px 8px #0001',
            }}>
              <img
                src="/locked.png"
                alt="Locked"
                width={36}
                height={36}
                style={{ filter: 'drop-shadow(0 2px 8px #0002)' }}
              />
            </div>
            <h1 style={{
              ...pixelFontStyle,
              fontSize: '1.1rem',
              color: '#a67c52',
              marginBottom: 6,
              fontWeight: 800,
              textShadow: '0 1px 0 #fff8',
              textAlign: 'center',
            }}>{isUnlocked ? 'Unlocked' : 'Locked'}</h1>
            <div style={{
              ...fontStyle,
              color: '#845954',
              textAlign: 'center',
              marginBottom: 8,
              fontSize: 15,
              fontWeight: 600,
              letterSpacing: 0.2,
            }}>
              Birthday Message
            </div>
            {!isUnlocked && (
              <div style={{
                ...fontStyle,
                color: '#bfae9c',
                textAlign: 'center',
                marginBottom: 10,
                fontSize: 14,
                fontWeight: 500,
                letterSpacing: 0.1,
                wordBreak: 'break-word',
              }}>
                <span style={{ fontWeight: 400 }}>({unlockDateString})</span>
              </div>
            )}
            {countdown && (
              <div className={styles.countdownBox}>
                <div style={{fontSize: 13, marginBottom: 2}}>COUNTDOWN:</div>
                <div style={{fontSize: 13, whiteSpace: 'nowrap'}}>
                  {countdown.days}D {countdown.hours}H {countdown.minutes}M {countdown.seconds}S
                </div>
              </div>
            )}
            {now && isUnlocked && !error && !opening && (
              <button
                className={styles.openButton}
                onClick={handleOpenClick}
              >
                OPEN
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 