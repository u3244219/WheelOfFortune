/**
 * AnswerReveal
 *
 * Shows what the answer actually was: the word, a picture of it, and one line
 * explaining what it is. Looked up live from Wikipedia, cached after the first
 * time. If the lookup fails or finds nothing, the card quietly shrinks to just
 * the word - it never blocks the game.
 */

import React, { useEffect, useState } from 'react';
import { lookupAnswer } from '../../services/lookup.service';
import './AnswerReveal.css';

const AnswerReveal = ({ word, category, hint }) => {
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (!word) return undefined;

    setLoading(true);
    setImageFailed(false);
    lookupAnswer(word, category)
      .then((result) => {
        if (!cancelled) {
          setInfo(result);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [word, category]);

  if (!word) return null;

  const showImage = info && info.image && !imageFailed;

  return (
    <div className="answer-reveal">
      <div className="answer-reveal-word">{word}</div>

      {loading && <div className="answer-reveal-skeleton" aria-hidden="true" />}

      {showImage && (
        <img
          className="answer-reveal-image"
          src={info.image}
          alt={word}
          loading="lazy"
          onError={() => setImageFailed(true)}
        />
      )}

      {info && info.blurb && (
        <p className="answer-reveal-blurb">{info.blurb}</p>
      )}

      {!loading && info && !info.blurb && hint && (
        <p className="answer-reveal-blurb">{hint}</p>
      )}

      {info && info.sourceUrl && (
        <a
          className="answer-reveal-source"
          href={info.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Read more
        </a>
      )}
    </div>
  );
};

export default AnswerReveal;
