"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
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
  const [showOpenUI, setShowOpenUI] = useState(true);
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
    setShowOpenUI(false);
    setTimeout(() => setShowConfetti(false), 6000);
    setTimeout(() => setShowContinue(true), 6000);
  }

  function handleContinueClick() {
    setShowLetterPage(true);
    setLetterPage(1);
  }

  function handleNextLetterPage() {
    setLetterPage(2);
  }

  function handlePrevLetterPage() {
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
                  margin: '48px auto 40px auto',
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
                  Happiest Birthday litol beabadoobee🤍, of course i wont forget about your birthday. you are already 22 years old, anyways i wish you all the best, even tho we're not together anymore, i always wish you the best 🤍 my heart for you is infinity ( hoping that i could on from you pero i doubt that i will, you always have a special place in my heart) you were the best thing that i have ever happen in my life. iim sorry if i treated you bad. i cant really tell if u have forgiven me already, but deep down i know that you dont. im sorry for everything i did and make you feel through those times na we are together pa, tbh i dont miss the memories that we have, i miss the person i had once before, YOU. everything u have did for me, i really appreciated it even tho i dont say it to you often but i did, and if u ever feel tired, just to let u know that im always here for u, im not expecting for a comeback (dang i wish), but anyways happy birthday Mary Angeli, the ms. future doctor. dont forget to a smile on your face and be good always.
                </div>
                <button className={styles.openButton} style={{ margin: '48px auto 64px auto' }} onClick={handleNextLetterPage}>Next</button>
              </>
            )}
            {letterPage === 2 && (
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
                  margin: '48px auto 40px auto',
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
                  stay safe always and stay healthy, i know u love maalat foods pero keep it maintained, i wish i could still taste ur dalgona coffee huhu, and im praying for a good recovery still for carly and say hello for me to trevor soafer cute ngani, your smile is the most cutiest and comfy thing i've seen in my layp, i love everything about you and that will includes ur flaws. ur existence matter and enough for me, so please take care of urself always at pupunta ka pa dream country mo and that would be new zealand, sorry di ko na mabibigay ung tulips that u want, i love that u are still gentle despite everything, i will never the sweet girl that i once liked, be happy cause smiling fits u well, even tho im not reason to it anymore, happy birthday

if i had one wish? i wish i could simply turn back the clock when we first met and take back every single mistake i made along the way that made you not want me anymore.
                </div>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 64, marginTop: 48 }}>
                  <button className={styles.openButton} style={{ margin: 0, minWidth: 90 }} onClick={handlePrevLetterPage}>Back</button>
                  <a href="/" className={styles.openButton} style={{ margin: 0, minWidth: 90 }}>Finish</a>
                </div>
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