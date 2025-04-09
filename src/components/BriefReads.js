import React from 'react';
import './BriefReads.css';

const quotes = [
  {
    id: 1,
    text: "وإذا مرّ يومٌ ولم أُذكر فيه، فذلك يومٌ ليس من عمري.",
    author: "محمود درويش",
    lang: 'AR',
  },
  {
    id: 2,
    text: "We read to know we are not alone.",
    author: "William Nicholson",
    lang: 'EN',
  },
  {
    id: 3,
    text: "من لم يشكر الناس لم يشكر الله.",
    author: "حديث نبوي",
    lang: 'AR',
  },
  {
    id: 4,
    text: "A reader lives a thousand lives before he dies.",
    author: "George R.R. Martin",
    lang: 'EN',
  },
  {
    id: 5,
    text: "اقرأ، فإن القراءة مفتاح المعرفة.",
    author: "مصطفى محمود",
    lang: 'AR',
  },
  {
    id: 6,
    text: "Books are a uniquely portable magic.",
    author: "Stephen King",
    lang: 'EN',
  },
];

const BriefReads = () => {
  return (
    <div className="brief-reads-container">
      <h2 className="brief-reads-title">📚 Brief Reads</h2>
      <div className="quote-feed">
        {quotes.map((quote) => (
          <div key={quote.id} className={`quote-card ${quote.lang === 'AR' ? 'rtl' : ''}`}>
            <p className="quote-text">“{quote.text}”</p>
            <p className="quote-author">— {quote.author}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BriefReads;
