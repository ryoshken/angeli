"use client";
import { useEffect } from "react";

export default function CustomCursor() {
  useEffect(() => {
    let cursor = document.querySelector('.custom-cursor') as HTMLDivElement | null;
    if (!cursor) {
      cursor = document.createElement('div');
      cursor.className = 'custom-cursor';
      document.body.appendChild(cursor);
    }
    const moveCursor = (e: MouseEvent) => {
      cursor!.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    };
    window.addEventListener('mousemove', moveCursor);

    const handlePointer = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const computedCursor = window.getComputedStyle(target).cursor;
      if (
        target.closest('a, button, .clickable, input, textarea, select') ||
        (computedCursor && computedCursor !== 'auto' && computedCursor !== 'default' && computedCursor !== 'none')
      ) {
        cursor!.classList.add('pointer');
      } else {
        cursor!.classList.remove('pointer');
      }
    };
    window.addEventListener('mouseover', handlePointer);
    window.addEventListener('mouseout', handlePointer);

    // Style the cursor if not already styled
    if (!document.getElementById('custom-cursor-style')) {
      const style = document.createElement('style');
      style.id = 'custom-cursor-style';
      style.innerHTML = `
        .custom-cursor {
          position: fixed;
          top: 0;
          left: 0;
          width: 32px;
          height: 32px;
          background: url('/cursor.png') center center no-repeat;
          background-size: contain;
          pointer-events: none;
          z-index: 9999;
          transition: filter 0.1s;
        }
        .custom-cursor.pointer {
          background: url('/pointer.png') center center no-repeat;
          background-size: contain;
          filter: brightness(1.5) drop-shadow(0 0 4px #fff7);
        }
      `;
      document.head.appendChild(style);
    }

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handlePointer);
      window.removeEventListener('mouseout', handlePointer);
      // Optionally, remove the cursor div and style on unmount
      // if (cursor && cursor.parentNode) cursor.parentNode.removeChild(cursor);
    };
  }, []);

  // No visible JSX, cursor is handled via portal
  return null;
} 