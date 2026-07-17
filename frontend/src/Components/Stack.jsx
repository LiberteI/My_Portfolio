import { motion as Motion } from 'framer-motion';
import { useRef, useState } from 'react';
import cornerOrnamentUrl from '/images/ui-textures/corner-ornament.svg';
import paperTextureUrl from '/images/ui-textures/compressed-img/paper-texture.webp';
import { ExperienceRecords } from '../data/experience/experience.data';

const cardOrnamentPositions = [
  {
    key: 'bottom-left',
    className: 'pointer-events-none absolute bottom-3 left-3 opacity-55'
  },
  {
    key: 'bottom-right',
    className: 'pointer-events-none absolute bottom-3 right-3 -rotate-90 opacity-55'
  },
  {
    key: 'top-left',
    className: 'pointer-events-none absolute left-3 top-3 rotate-90 opacity-55'
  },
  {
    key: 'top-right',
    className: 'pointer-events-none absolute right-3 top-3 rotate-180 opacity-55'
  }
];

function CardPaperFrame({ ornamentSize }) {
  return (
    <>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${paperTextureUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 1
        }}
      />

      {cardOrnamentPositions.map((ornament) => (
        <img
          key={ornament.key}
          src={cornerOrnamentUrl}
          alt=""
          aria-hidden="true"
          className={ornament.className}
          style={{ width: ornamentSize, height: ornamentSize }}
        />
      ))}
    </>
  );
}

function ExperienceCardHeader({
  card,
  contentScale,
  iconSize,
  titleFontSize,
  metaFontSize,
  bodyFontSize,
  periodFontSize
}) {
  return (
    <div className="flex-1 space-y-3" style={{ rowGap: 12 * contentScale }}>
      <div className="flex items-start gap-3" style={{ columnGap: 12 * contentScale }}>
        <div
          className="flex shrink-0 items-center justify-center rounded-xl border border-black/10 bg-black/5 uppercase text-black/70"
          style={{
            width: iconSize,
            height: iconSize,
            fontSize: 10 * contentScale,
            letterSpacing: `${0.2 * contentScale}em`
          }}
        >
          {card.orgLogo ? (
            <img src={card.orgLogo} alt={card.orgName || card.title} className="h-full w-full object-contain pointer-events-none" />
          ) : (
            <span>EXP</span>
          )}
        </div>

        <div className="space-y-2" style={{ rowGap: 8 * contentScale }}>
          <p className="leading-tight text-black" style={{ fontSize: titleFontSize }}>{card.title}</p>

          {card.subtitle ? (
            <p className="uppercase text-black/65" style={{ fontSize: metaFontSize, letterSpacing: `${0.18 * contentScale}em` }}>{card.subtitle}</p>
          ) : null}

          {card.orgName ? (
            <p className="leading-snug text-black/80" style={{ fontSize: bodyFontSize }}>{card.orgName}</p>
          ) : null}

          {card.period ? (
            <p className="uppercase text-black/60" style={{ fontSize: periodFontSize, letterSpacing: `${0.22 * contentScale}em` }}>{card.period}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function ExperienceCardDescription({
  card,
  isSelected,
  contentScale,
  descriptionIndent,
  descriptionFontSize,
  descriptionLineHeight
}) {
  const hasDetailedBulletPoints = Array.isArray(card.detailedBulletPoints) && card.detailedBulletPoints.length > 0;
  const descriptionPaddingLeft = isSelected ? 0 : descriptionIndent;

  return (
    <div className="flex flex-1 items-start pt-4" style={{ paddingLeft: descriptionPaddingLeft, paddingTop: 16 * contentScale }}>
      {isSelected && hasDetailedBulletPoints ? (
        <ul className="w-full list-disc text-black/80" style={{ fontSize: descriptionFontSize, lineHeight: `${descriptionLineHeight}px`, paddingLeft: 20 * contentScale }}>
          {card.detailedBulletPoints.map((bulletPoint) => (
            <li key={bulletPoint}>{bulletPoint}</li>
          ))}
        </ul>
      ) : card.shortDescription ? (
        <p className="text-black/80" style={{ fontSize: descriptionFontSize, lineHeight: `${descriptionLineHeight}px` }}>
          {card.shortDescription}
        </p>
      ) : null}
    </div>
  );
}

function getCardMotionProps({
  isSelected,
  isHovered,
  selectedPosition,
  hoverTranslateX,
  baseTranslateX,
  hoverTranslateY,
  baseTranslateY,
  baseRotate,
  hoverScale,
  baseScale,
  idleDuration,
  cardDimensions
}) {
  return {
    animate: {
      x: isSelected ? selectedPosition.x : isHovered ? hoverTranslateX : baseTranslateX,
      y: isSelected
        ? selectedPosition.y
        : isHovered
          ? hoverTranslateY
          : [baseTranslateY, baseTranslateY - 5, baseTranslateY, baseTranslateY + 3, baseTranslateY],
      rotate: isSelected
        ? 0
        : isHovered
          ? baseRotate
          : [baseRotate, baseRotate + 0.35, baseRotate, baseRotate - 0.25, baseRotate],
      scale: isSelected || isHovered ? hoverScale : baseScale
    },
    transition: {
      x: { duration: 0.28, ease: 'easeOut' },
      y: isSelected || isHovered
        ? { duration: 0.28, ease: 'easeOut' }
        : { duration: idleDuration, repeat: Infinity, ease: 'easeInOut' },
      rotate: isSelected || isHovered
        ? { duration: 0.28, ease: 'easeOut' }
        : { duration: idleDuration, repeat: Infinity, ease: 'easeInOut' },
      scale: { duration: 0.28, ease: 'easeOut' }
    },
    style: {
      width: cardDimensions.width,
      height: isSelected ? 'auto' : cardDimensions.height,
      minHeight: cardDimensions.height,
      transformOrigin: 'center center'
    }
  };
}

export default function Stack({
  randomRotation = false,
  cardDimensions = { width: 208, height: 208 }
}) {
  const stackRef = useRef(null);
  const [hoveredCardId, setHoveredCardId] = useState(null);
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [selectedPosition, setSelectedPosition] = useState({ x: 0, y: 0 });
  const contentScale = Math.max(0.7, cardDimensions.width / 400);
  const ornamentSize = Math.round(56 * contentScale);
  const iconSize = Math.round(48 * contentScale);
  const titleFontSize = 18 * contentScale;
  const metaFontSize = 12 * contentScale;
  const bodyFontSize = 14 * contentScale;
  const periodFontSize = 11 * contentScale;
  const descriptionFontSize = 14 * contentScale;
  const descriptionLineHeight = 24 * contentScale;
  const contentPadding = 12 * contentScale;
  const descriptionIndent = 60 * contentScale;
  const cards = ExperienceRecords.map((experience, index) => ({
    id: `${experience.orgName || experience.title}-${index}`,
    ...experience
  }));
  const handleCardClick = (cardId, event) => {
    if (selectedCardId === cardId) {
      setSelectedCardId(null);
      setSelectedPosition({ x: 0, y: 0 });
      return;
    }

    if (!stackRef.current) {
      return;
    }

    const stackRect = stackRef.current.getBoundingClientRect();
    const cardRect = event.currentTarget.getBoundingClientRect();
    const nextSelectedX = window.innerWidth / 2 - stackRect.left - cardRect.width / 2;
    const nextSelectedY = window.innerHeight / 2 - stackRect.top - cardRect.height / 2;

    setSelectedCardId(cardId);
    setSelectedPosition({ x: nextSelectedX, y: nextSelectedY });
  };

  return (
    <div
      ref={stackRef}
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
        const isSelected = selectedCardId === card.id;
        const baseTranslateX = index * 18;
        const baseTranslateY = index * 150 - 50;
        const baseRotate = index * 5 - 5 + randomRotate;
        const baseScale = 1 + index * 0.06 - cards.length * 0.06;
        const hoverTranslateX = baseTranslateX - 80;
        const hoverTranslateY = baseTranslateY;
        const hoverScale = baseScale + 0.04;
        const idleDuration = 5.8 + index * 0.45;
        const motionProps = getCardMotionProps({
          isSelected,
          isHovered,
          selectedPosition,
          hoverTranslateX,
          baseTranslateX,
          hoverTranslateY,
          baseTranslateY,
          baseRotate,
          hoverScale,
          baseScale,
          idleDuration,
          cardDimensions
        });

        return (
          <Motion.div
            key={card.id}
            className="absolute transition-transform duration-300 ease-out"
            onMouseEnter={() => setHoveredCardId(card.id)}
            onMouseLeave={() => setHoveredCardId(null)}
            {...motionProps}
          >
            <button
              onClick={(event) => handleCardClick(card.id, event)}
              type="button"
              className={`cursor-pointer relative flex h-full w-full flex-col justify-between overflow-hidden rounded-2xl bg-[#171311] p-5 text-left text-stone-100 shadow-[0_18px_60px_rgba(0,0,0,0.35)] transition-shadow duration-300 ease-out ${isSelected ? 'border border-black/20' : 'border-0'}`}
              style={{ height: isSelected ? 'auto' : '100%', minHeight: cardDimensions.height, overflow: isSelected ? 'visible' : 'hidden' }}
            >
              
              <CardPaperFrame ornamentSize={ornamentSize} />

              <div className="relative z-10 flex h-full flex-col text-black" style={{ padding: contentPadding }}>
                <ExperienceCardHeader
                  card={card}
                  contentScale={contentScale}
                  iconSize={iconSize}
                  titleFontSize={titleFontSize}
                  metaFontSize={metaFontSize}
                  bodyFontSize={bodyFontSize}
                  periodFontSize={periodFontSize}
                />

                <div className="mx-auto h-px w-full max-w-md bg-gradient-to-r from-transparent via-black/70 to-transparent" />

                <ExperienceCardDescription
                  card={card}
                  isSelected={isSelected}
                  contentScale={contentScale}
                  descriptionIndent={descriptionIndent}
                  descriptionFontSize={descriptionFontSize}
                  descriptionLineHeight={descriptionLineHeight}
                />
              </div>
            </button>
          </Motion.div>
        );
      })}
    </div>
  );
}
