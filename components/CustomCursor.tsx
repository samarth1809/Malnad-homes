
import React, { useEffect, useRef, useState } from 'react';

export const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null); 
  const followerRef = useRef<HTMLDivElement>(null); 
  
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(pointer: fine)');
    if (!mediaQuery.matches) return;

    let mouseX = -100;
    let mouseY = -100;
    let followerX = -100;
    let followerY = -100;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isVisible) setIsVisible(true);
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      }
    };

    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);
    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Enhanced detection for Filter elements (inputs, labels, selects)
      const isInteractive = 
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.tagName === 'LABEL' ||
        target.closest('button') ||
        target.closest('a') ||
        target.closest('label') ||
        target.closest('select') ||
        target.closest('input') ||
        target.classList.contains('cursor-pointer') ||
        target.closest('[role="button"]');

      setIsHovering(!!isInteractive);
    };

    let animationFrameId: number;
    const animate = () => {
      const ease = 0.15;
      followerX += (mouseX - followerX) * ease;
      followerY += (mouseY - followerY) * ease;
      if (followerRef.current) {
        followerRef.current.style.transform = `translate3d(${followerX}px, ${followerY}px, 0) translate(-50%, -50%)`;
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseover', onMouseOver);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);
    animate();

    const style = document.createElement('style');
    style.innerHTML = `
      @media (pointer: fine) {
        body, a, button, input, textarea, select, label {
          cursor: none !important;
        }
      }
    `;
    document.head.appendChild(style);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      cancelAnimationFrame(animationFrameId);
      document.head.removeChild(style);
    };
  }, [isVisible]);

  if (typeof window !== 'undefined' && window.matchMedia && !window.matchMedia('(pointer: fine)').matches) {
    return null;
  }

  return (
    <>
      <div 
        ref={cursorRef}
        className={`fixed top-0 left-0 pointer-events-none z-[9999] rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)] transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        } ${
          isClicking ? 'w-1.5 h-1.5' : 'w-2.5 h-2.5'
        }`}
        style={{ willChange: 'transform' }}
      />
      <div 
        ref={followerRef}
        className={`fixed top-0 left-0 pointer-events-none z-[9998] rounded-full border border-emerald-500/30 transition-all duration-300 ease-out ${
          isVisible ? 'opacity-100' : 'opacity-0'
        } ${
          isClicking 
            ? 'w-8 h-8 bg-emerald-500/10 border-emerald-400 scale-75' 
            : isHovering 
              ? 'w-12 h-12 bg-emerald-500/5 border-emerald-400/50 scale-100' 
              : 'w-8 h-8 border-emerald-500/30 scale-100' 
        }`}
        style={{ willChange: 'transform' }}
      />
    </>
  );
};
