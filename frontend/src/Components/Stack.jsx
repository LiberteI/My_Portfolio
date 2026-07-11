import { motion, useMotionValue, useTransform } from 'framer-motion';
import React, { useState, useEffect } from 'react';
import cornerOrnamentUrl from '/images/cornor-ornament.svg';
import paperTextureUrl from '/images/paper-texture.jpg';
import { ExperienceRecords } from '../data/experience/experience.data';

function DraggableWrapper({ children, onSendToBack, sensitivity }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [60, -60]);
  const rotateY = useTransform(x, [-100, 100], [-60, 60]);

  function handleDragEnd(_, info) {
    if (Math.abs(info.offset.x) > sensitivity || Math.abs(info.offset.y) > sensitivity) {
      onSendToBack();
    } else {
      x.set(0);
      y.set(0);
    }
  }

  return (
    <motion.div
      className="absolute cursor-grab"
      style={{ x, y, rotateX, rotateY }}
      drag
      dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
      dragElastic={0.6}
      whileTap={{ cursor: 'grabbing' }}
      onDragEnd={handleDragEnd}
    >
      {children}
    </motion.div>
  );
}

export default function Stack({
  randomRotation = false,
  sensitivity = 200,
  cardDimensions = { width: 208, height: 208 },
  animationConfig = { stiffness: 260, damping: 20 },
  sendToBackOnClick = false,
  autoScroll = false,
  autoScrollInterval = 3000
}) {
  const [cards, setCards] = useState(
    ExperienceRecords.map((experience, index) => ({
      id: `${experience.orgName || experience.title}-${index}`,
      ...experience
    }))
  );

  const sendToBack = id => {
    setCards(prev => {
      const newCards = [...prev];
      const index = newCards.findIndex(card => card.id === id);
      const [card] = newCards.splice(index, 1);
      newCards.unshift(card);
      return newCards;
    });
  };

  // Auto-scroll functionality
  useEffect(() => {
    if (autoScroll && cards.length > 1) {
      const interval = setInterval(() => {
        // Send the top card (last in array) to back to bring next card to front
        const topCardId = cards[cards.length - 1].id;
        sendToBack(topCardId);
      }, autoScrollInterval);

      return () => clearInterval(interval);
    }
  }, [autoScroll, autoScrollInterval, cards.length, cards]);

  return (
    <div
      className="relative"
      style={{
        width: cardDimensions.width,
        height: cardDimensions.height,
        perspective: 600
      }}
    >
      {cards.map((card, index) => {
        const randomRotate = randomRotation ? Math.random() * 10 - 5 : 0;

        return (
          <DraggableWrapper key={card.id} onSendToBack={() => sendToBack(card.id)} sensitivity={sensitivity}>
            <motion.div
              className="relative flex flex-col justify-between overflow-hidden rounded-2xl bg-[#171311] p-5 text-stone-100 shadow-[0_18px_60px_rgba(0,0,0,0.35)]"
              onClick={() => sendToBackOnClick && sendToBack(card.id)}
              animate={{
                x: index * 18 - 60,
                y: index * 100,
                rotateZ: index * 5 - 5,
                scale: 1 + index * 0.06 - cards.length * 0.06,
                transformOrigin: 'center center'
              }}
              initial={false}
              transition={{
                type: 'spring',
                stiffness: animationConfig.stiffness,
                damping: animationConfig.damping
              }}
              style={{
                width: cardDimensions.width,
                height: cardDimensions.height
              }}
            >   
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `url(${paperTextureUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  opacity: 1
                }}
              />
              <div className="relative z-10 flex h-full flex-col text-black">
                <div className="flex-1 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-black/10 bg-black/5 text-[10px] uppercase tracking-[0.2em] text-black/70">
                      {card.orgLogo ? (
                        <img src={card.orgLogo} alt={card.orgName || card.title} className="h-full w-full object-contain pointer-events-none" />
                      ) : (
                        <span>EXP</span>
                      )}
                    </div>

                    <div className="space-y-2">
                      <p className="text-lg leading-tight text-black">{card.title}</p>

                      {card.subtitle ? (
                        <p className="text-xs uppercase tracking-[0.18em] text-black/65">{card.subtitle}</p>
                      ) : null}

                      {card.orgName ? (
                        <p className="text-sm leading-snug text-black/80">{card.orgName}</p>
                      ) : null}
                    </div>
                  </div>

                  {card.period ? (
                    <p className="text-[11px] uppercase tracking-[0.22em] text-black/60">{card.period}</p>
                  ) : null}
                </div>

                <div className="mx-auto h-px w-full max-w-md bg-gradient-to-r from-transparent via-black/70 to-transparent" />

                <div className="flex-1" />
              </div>

            </motion.div>
          </DraggableWrapper>
        );
      })}
    </div>
  );
}
