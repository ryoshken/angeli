"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import styles from "./page.module.css";

/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */

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
      Array.from(eq.children).forEach((bar) => {
        (bar as HTMLElement).style.height = Math.random() * 32 + 16 + 'px';
      });
    }, 180);

    playBtn.onclick = () => {
      if (audio.paused) {
        audio.play();
        playIcon.style.display = 'none';
        pauseIcon.style.display = '';
        eqInterval = setInterval(() => {
          Array.from(eq.children).forEach((bar) => {
            (bar as HTMLElement).style.height = Math.random() * 32 + 16 + 'px';
          });
        }, 180);
      } else {
        audio.pause();
        playIcon.style.display = '';
        pauseIcon.style.display = 'none';
        clearInterval(eqInterval);
        Array.from(eq.children).forEach((bar) => {
          (bar as HTMLElement).style.height = '16px';
        });
      }
    };
    audio.onpause = () => {
      playIcon.style.display = '';
      pauseIcon.style.display = 'none';
      clearInterval(eqInterval);
      Array.from(eq.children).forEach((bar) => {
        (bar as HTMLElement).style.height = '16px';
      });
    };
    audio.onplay = () => {
      playIcon.style.display = 'none';
      pauseIcon.style.display = '';
      eqInterval = setInterval(() => {
        Array.from(eq.children).forEach((bar) => {
          (bar as HTMLElement).style.height = Math.random() * 32 + 16 + 'px';
        });
      }, 180);
    };
    return () => {
      clearInterval(eqInterval);
    };
  }, [showStickers]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError("") , 2000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div className={styles.pixelBg}>
      {step !== 'success' && (
        <div className={styles.pixelBrowserWindow + (step === 'start' ? ' ' + styles.startScreen : '')}>
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
              <span className={styles.cardIcon + ' ' + styles.cardCoin} style={{ top: 32, left: 0, position: 'absolute' }}
                tabIndex={0}
                role="button"
                onClick={() => setShowStickers(true)}
                title="Show Song Player"
              >
                <img src="/bea.png" alt="Bea Icon" width="70" height="80" className="pixel-art" />
              </span>
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
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
          {notebookPage < 4 && (
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
                  <div className={styles.notebookClickHint}>
                    Click me to open
                  </div>
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
                  <span className={styles.notebookPageNum}>{notebookPage + 1} / 5</span>
                </div>
                <button
                  className={styles.notebookNavBtn}
                  onClick={() => setNotebookPage(p => Math.min(4, p + 1))}
                  disabled={notebookPage === 4}
                >
                  &gt;
                </button>
              </div>
            </div>
          )}
          {notebookPage === 4 && (
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
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, height: '100%', minHeight: 320 }}>
                <a
                  href="/secret"
                  className={styles.lockIconLink}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textDecoration: 'none', cursor: 'pointer', margin: '0 auto' }}
                  title="Go to Secret Page"
                >
                  <img
                    src="/locked.png"
                    alt="Locked Icon"
                    width={72}
                    height={72}
                    style={{ marginBottom: 10, imageRendering: 'pixelated', transition: 'transform 0.15s' }}
                    className="pixel-art"
                  />
                  <span style={{ fontFamily: '"Press Start 2P", monospace', color: '#a67c52', fontSize: 20, letterSpacing: 1.5, marginTop: 12 }}>Secret Page</span>
                </a>
              </div>
            </div>
          )}
          {showLetter && notebookPage < 4 && (
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
