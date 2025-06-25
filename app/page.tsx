"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import styles from "./page.module.css";

const notebookPages = [
  "Welcome to your pixel notebook!",
  "Page 2: You can put any text here.",
  "Page 3: Add your notes, secrets, or recipes!",
  "Page 4: The end. Have a sweet day!"
];

export default function Home() {
  const [step, setStep] = useState<'start' | 'focus' | 'success'>('start');
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showStickers, setShowStickers] = useState(false);
  const [notebookPage, setNotebookPage] = useState(0);
  const [showLetter, setShowLetter] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  useEffect(() => {
    const cursor = document.querySelector('.custom-cursor') as HTMLDivElement | null;
    if (!cursor) return;
    const moveCursor = (e: MouseEvent) => {
      cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    };
    window.addEventListener('mousemove', moveCursor);

    // Robust pointer state with event delegation
    const handlePointer = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const computedCursor = window.getComputedStyle(target).cursor;
      if (
        target.closest('a, button, .clickable, input, textarea, select') ||
        (computedCursor && computedCursor !== 'auto' && computedCursor !== 'default' && computedCursor !== 'none')
      ) {
        cursor.classList.add('pointer');
      } else {
        cursor.classList.remove('pointer');
      }
    };
    window.addEventListener('mouseover', handlePointer);
    window.addEventListener('mouseout', handlePointer);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handlePointer);
      window.removeEventListener('mouseout', handlePointer);
    };
  }, []);

  useEffect(() => {
    const audio = document.getElementById('custom-audio') as HTMLAudioElement | null;
    const playBtn = document.getElementById('audio-play-btn') as HTMLButtonElement | null;
    const playIcon = document.getElementById('audio-play-icon');
    const pauseIcon = document.getElementById('audio-pause-icon');
    const eq = document.getElementById('audio-eq');
    let eqInterval: any = null;
    if (!audio || !playBtn || !playIcon || !pauseIcon || !eq) return;

    // Autoplay on open
    audio.play().catch(() => {});
    playIcon.style.display = 'none';
    pauseIcon.style.display = '';
    eqInterval = setInterval(() => {
      Array.from(eq.children).forEach((bar: any) => {
        bar.style.height = Math.random() * 32 + 16 + 'px';
      });
    }, 180);

    playBtn.onclick = () => {
      if (audio.paused) {
        audio.play();
        playIcon.style.display = 'none';
        pauseIcon.style.display = '';
        eqInterval = setInterval(() => {
          Array.from(eq.children).forEach((bar: any) => {
            bar.style.height = Math.random() * 32 + 16 + 'px';
          });
        }, 180);
      } else {
        audio.pause();
        playIcon.style.display = '';
        pauseIcon.style.display = 'none';
        clearInterval(eqInterval);
        Array.from(eq.children).forEach((bar: any) => {
          bar.style.height = '16px';
        });
      }
    };
    audio.onpause = () => {
      playIcon.style.display = '';
      pauseIcon.style.display = 'none';
      clearInterval(eqInterval);
      Array.from(eq.children).forEach((bar: any) => {
        bar.style.height = '16px';
      });
    };
    audio.onplay = () => {
      playIcon.style.display = 'none';
      pauseIcon.style.display = '';
      eqInterval = setInterval(() => {
        Array.from(eq.children).forEach((bar: any) => {
          bar.style.height = Math.random() * 32 + 16 + 'px';
        });
      }, 180);
    };
    return () => {
      clearInterval(eqInterval);
    };
  }, [showStickers]);

  return (
    <div className={styles.pixelBg}>
      {step !== 'success' && (
        <div className={step === 'start' ? `${styles.centerCard} ${styles.startScreen}` : styles.centerCard}>
          <div className={styles.windowHeader}>
            {step === 'start' && <span className={styles.title}>Hello Geli!</span>}
            {step === 'start' && (
              <span className={styles.windowControls}>
                <span className={styles.minimize}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="7" width="8" height="2" rx="1" fill="#4a2c23" />
                  </svg>
                </span>
                <span className={styles.close}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <line x1="4" y1="4" x2="10" y2="10" stroke="#4a2c23" strokeWidth="2" strokeLinecap="round" />
                    <line x1="10" y1="4" x2="4" y2="10" stroke="#4a2c23" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </span>
              </span>
            )}
            {step === 'focus' && (
              <>
                <span className={styles.cardIcon + ' ' + styles.cardCoin}
                  tabIndex={0}
                  role="button"
                  onClick={() => setShowStickers(true)}
                  style={{ pointerEvents: 'auto' }}
                  title="Show Song Player"
                >
                  <img src="/bea.png" alt="Bea Icon" width="70" height="80" className="pixel-art" />
                </span>
              </>
            )}
          </div>
          {step === 'start' && (
            <>
              <div className={styles.subtitle}>
                hope this letter finds you well.
              </div>
              <div className={styles.pixelArtWrapper}>
                <Image
                  src="/marceline.gif"
                  alt="Marceline"
                  width={320}
                  height={220}
                  className={styles.pixelArt}
                  priority
                />
              </div>
              <button className={styles.startBtn} onClick={() => setStep('focus')}>
                Start
              </button>
            </>
          )}
          {step === 'focus' && (
            <>
              <div className={styles.pixelArtWrapper + ' ' + styles.noBorder}>
                <Image
                  src="/password.gif"
                  alt="Password Cat"
                  width={260}
                  height={260}
                  className={styles.pixelArt}
                  priority
                />
              </div>
              <form
                className={styles.passwordForm}
                onSubmit={e => {
                  e.preventDefault();
                  if (password === "tulips") {
                    setError("");
                    setStep('success');
                  } else {
                    setError("Incorrect password. Try again!");
                  }
                }}
              >
                <input
                  className={styles.passwordInput}
                  type="password"
                  placeholder={!passwordFocused && password === "" ? "hint: flower" : ""}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                />
                <button className={styles.startBtn} type="submit">
                  Enter
                </button>
              </form>
              {error && <div className={styles.errorMsg}>{error}</div>}
            </>
          )}
        </div>
      )}
      {step === 'success' && (
        <div className={styles.centerCard}>
          <Image
            src="/book.png"
            alt="Notebook"
            width={72}
            height={54}
            className={styles.notebookBookImg}
          />
          <div
            className={styles.notebookText}
            tabIndex={0}
            role="button"
            onClick={() => setShowLetter(true)}
            style={{ cursor: 'pointer' }}
            title="Click to view letter"
          >
            <div className={styles.notebookRow}>
              <Image
                src={`/open${notebookPage === 0 ? '' : notebookPage + 1}.gif`}
                alt={`Open Gif Page ${notebookPage + 1}`}
                width={96}
                height={96}
                className={styles.notebookCuteGif}
                unoptimized
              />
              <div className={styles.notebookClickHint}>Click me to open</div>
            </div>
          </div>
          <div className={styles.notebookNav}>
            <button
              className={styles.notebookNavBtn}
              onClick={() => setNotebookPage(p => Math.max(0, p - 1))}
              disabled={notebookPage === 0}
            >
              &lt;
            </button>
            <div className={styles.notebookPageCol}>
              <span className={styles.notebookPageLabel}>Page</span>
              <span className={styles.notebookPageNum}>{notebookPage + 1} / 4</span>
            </div>
            <button
              className={styles.notebookNavBtn}
              onClick={() => setNotebookPage(p => Math.min(3, p + 1))}
              disabled={notebookPage === 3}
            >
              &gt;
            </button>
          </div>
          {showLetter && (
            <div className={styles.letterModalOverlay}>
              <div className={styles.letterModal}>
                <Image
                  src={`/${notebookPage + 1}.png`}
                  alt={`Letter page ${notebookPage + 1}`}
                  width={220}
                  height={300}
                  className={styles.letterImg}
                  unoptimized
                />
                <button className={styles.letterCloseBtn} onClick={() => setShowLetter(false)}>
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      {showStickers && (
        <div className={styles.stickerModalOverlay}>
          <div className={styles.stickerModal + ' ' + styles.audioModal}>
            <div className={styles.audioNowPlayingHeader}>
              <span className={styles.audioNowPlayingText}>Now playing:</span>
              <span className={styles.audioNowPlayingArtist} style={{color: '#1db954'}}>beabadoobee</span>
            </div>
            <div className={styles.audioPlayerRow}>
              <button className={styles.audioPlayBtn} id="audio-play-btn">
                <span id="audio-play-icon">▶</span>
                <span id="audio-pause-icon" style={{display: 'none'}}>❚❚</span>
              </button>
              <div className={styles.audioVisualizerWrapper}>
                <div className={styles.audioVisualizer} id="audio-eq">
                  <div className={styles.eqBar}></div>
                  <div className={styles.eqBar}></div>
                  <div className={styles.eqBar}></div>
                  <div className={styles.eqBar}></div>
                  <div className={styles.eqBar}></div>
                  <div className={styles.eqBar}></div>
                  <div className={styles.eqBar}></div>
                  <div className={styles.eqBar}></div>
                  <div className={styles.eqBar}></div>
                  <div className={styles.eqBar}></div>
                  <div className={styles.eqBar}></div>
                  <div className={styles.eqBar}></div>
                  <div className={styles.eqBar}></div>
                  <div className={styles.eqBar}></div>
                  <div className={styles.eqBar}></div>
                  <div className={styles.eqBar}></div>
                  <div className={styles.eqBar}></div>
                  <div className={styles.eqBar}></div>
                </div>
              </div>
            </div>
            <span className={styles.audioSongTitle}>everything i want.mp3</span>
            <audio id="custom-audio" src="/song.mp3" preload="auto"></audio>
            <button className={styles.stickerCloseBtn} onClick={() => setShowStickers(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
