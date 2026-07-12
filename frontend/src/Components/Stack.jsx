import { motion } from 'framer-motion';
import { useState } from 'react';
import cornerOrnamentUrl from '/images/cornor-ornament.svg';
import paperTextureUrl from '/images/paper-texture.jpg';
import { ExperienceRecords } from '../data/experience/experience.data';

export default function Stack({
  randomRotation = false,
  cardDimensions = { width: 208, height: 208 }
}) {
  const [hoveredCardId, setHoveredCardId] = useState(null);
  const cards = ExperienceRecords.map((experience, index) => ({
    id: `${experience.orgName || experience.title}-${index}`,
    ...experience
  }));

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
        const isHovered = hoveredCardId === card.id;
        const baseTranslateX = index * 18 - 60;
        const baseTranslateY = index * 100;
        const baseRotate = index * 5 - 5 + randomRotate;
        const baseScale = 1 + index * 0.06 - cards.length * 0.06;
        const hoverTranslateX = baseTranslateX + 24;
        const hoverTranslateY = baseTranslateY - 28;
        const hoverScale = baseScale + 0.04;
        const idleDuration = 5.8 + index * 0.45;

        return (
          <motion.div
            key={card.id}
            className="absolute transition-transform duration-300 ease-out"
            onMouseEnter={() => setHoveredCardId(card.id)}
            onMouseLeave={() => setHoveredCardId(null)}
            animate={{
              x: isHovered ? hoverTranslateX : baseTranslateX,
              y: isHovered ? hoverTranslateY : [baseTranslateY, baseTranslateY - 5, baseTranslateY, baseTranslateY + 3, baseTranslateY],
              rotate: isHovered ? baseRotate : [baseRotate, baseRotate + 0.35, baseRotate, baseRotate - 0.25, baseRotate],
              scale: isHovered ? hoverScale : baseScale
            }}
            transition={{
              x: { duration: 0.28, ease: 'easeOut' },
              y: isHovered
                ? { duration: 0.28, ease: 'easeOut' }
                : { duration: idleDuration, repeat: Infinity, ease: 'easeInOut' },
              rotate: isHovered
                ? { duration: 0.28, ease: 'easeOut' }
                : { duration: idleDuration, repeat: Infinity, ease: 'easeInOut' },
              scale: { duration: 0.28, ease: 'easeOut' }
            }}
            style={{
              zIndex: isHovered ? cards.length + 10 : index + 1,
              width: cardDimensions.width,
              height: cardDimensions.height,
              transformOrigin: 'center center'
            }}
          >
            <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-2xl bg-[#171311] p-5 text-stone-100 shadow-[0_18px_60px_rgba(0,0,0,0.35)] transition-shadow duration-300 ease-out">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `url(${paperTextureUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  opacity: 1
                }}
              />
              {/* Bottom-left ornament */}
              <img
                src={cornerOrnamentUrl}
                alt=""
                aria-hidden="true"
                className="pointer-events-none absolute bottom-3 left-3 h-14 w-14 opacity-55"
              />
              {/* Bottom-right ornament */}
              <img
                src={cornerOrnamentUrl}
                alt=""
                aria-hidden="true"
                className="pointer-events-none absolute bottom-3 right-3 h-14 w-14 -rotate-90 opacity-55"
              />
              {/* Top-left ornament */}
              <img
                src={cornerOrnamentUrl}
                alt=""
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-3 h-14 w-14 rotate-90 opacity-55"
              />
              {/* Top-right ornament */}
              <img
                src={cornerOrnamentUrl}
                alt=""
                aria-hidden="true"
                className="pointer-events-none absolute right-3 top-3 h-14 w-14 rotate-180 opacity-55"
              />
              <div className="relative z-10 flex h-full flex-col p-3 text-black">
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
                      {card.period ? (
                        <p className="text-[11px] uppercase tracking-[0.22em] text-black/60">{card.period}</p>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="mx-auto h-px w-full max-w-md bg-gradient-to-r from-transparent via-black/70 to-transparent" />

                <div className="flex flex-1 items-start pl-[3.75rem] pt-4">
                  {card.shortDescription ? (
                    <p className="text-sm leading-6 text-black/80">
                      {card.shortDescription}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
