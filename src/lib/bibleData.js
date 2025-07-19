import { bibleARC } from './bible-arc';

export const bibleBooks = [
  { name: 'Gênesis', abbrev: 'gn', chapters: 50, testament: 'VT', englishName: 'Genesis' },
  { name: 'Êxodo', abbrev: 'ex', chapters: 40, testament: 'VT', englishName: 'Exodus' },
  { name: 'Levítico', abbrev: 'lv', chapters: 27, testament: 'VT', englishName: 'Leviticus' },
  { name: 'Números', abbrev: 'nm', chapters: 36, testament: 'VT', englishName: 'Numbers' },
  { name: 'Deuteronômio', abbrev: 'dt', chapters: 34, testament: 'VT', englishName: 'Deuteronomy' },
  { name: 'Josué', abbrev: 'js', chapters: 24, testament: 'VT', englishName: 'Joshua' },
  { name: 'Juízes', abbrev: 'jz', chapters: 21, testament: 'VT', englishName: 'Judges' },
  { name: 'Rute', abbrev: 'rt', chapters: 4, testament: 'VT', englishName: 'Ruth' },
  { name: '1 Samuel', abbrev: '1sm', chapters: 31, testament: 'VT', englishName: '1 Samuel' },
  { name: '2 Samuel', abbrev: '2sm', chapters: 24, testament: 'VT', englishName: '2 Samuel' },
  { name: '1 Reis', abbrev: '1rs', chapters: 22, testament: 'VT', englishName: '1 Kings' },
  { name: '2 Reis', abbrev: '2rs', chapters: 25, testament: 'VT', englishName: '2 Kings' },
  { name: '1 Crônicas', abbrev: '1cr', chapters: 29, testament: 'VT', englishName: '1 Chronicles' },
  { name: '2 Crônicas', abbrev: '2cr', chapters: 36, testament: 'VT', englishName: '2 Chronicles' },
  { name: 'Esdras', abbrev: 'ed', chapters: 10, testament: 'VT', englishName: 'Ezra' },
  { name: 'Neemias', abbrev: 'ne', chapters: 13, testament: 'VT', englishName: 'Nehemiah' },
  { name: 'Ester', abbrev: 'et', chapters: 10, testament: 'VT', englishName: 'Esther' },
  { name: 'Jó', abbrev: 'job', chapters: 42, testament: 'VT', englishName: 'Job' },
  { name: 'Salmos', abbrev: 'sl', chapters: 150, testament: 'VT', englishName: 'Psalms' },
  { name: 'Provérbios', abbrev: 'pv', chapters: 31, testament: 'VT', englishName: 'Proverbs' },
  { name: 'Eclesiastes', abbrev: 'ec', chapters: 12, testament: 'VT', englishName: 'Ecclesiastes' },
  { name: 'Cantares', abbrev: 'ct', chapters: 8, testament: 'VT', englishName: 'Song of Solomon' },
  { name: 'Isaías', abbrev: 'is', chapters: 66, testament: 'VT', englishName: 'Isaiah' },
  { name: 'Jeremias', abbrev: 'jr', chapters: 52, testament: 'VT', englishName: 'Jeremiah' },
  { name: 'Lamentações', abbrev: 'lm', chapters: 5, testament: 'VT', englishName: 'Lamentations' },
  { name: 'Ezequiel', abbrev: 'ez', chapters: 48, testament: 'VT', englishName: 'Ezekiel' },
  { name: 'Daniel', abbrev: 'dn', chapters: 12, testament: 'VT', englishName: 'Daniel' },
  { name: 'Oséias', abbrev: 'os', chapters: 14, testament: 'VT', englishName: 'Hosea' },
  { name: 'Joel', abbrev: 'jl', chapters: 3, testament: 'VT', englishName: 'Joel' },
  { name: 'Amós', abbrev: 'am', chapters: 9, testament: 'VT', englishName: 'Amos' },
  { name: 'Obadias', abbrev: 'ob', chapters: 1, testament: 'VT', englishName: 'Obadiah' },
  { name: 'Jonas', abbrev: 'jn', chapters: 4, testament: 'VT', englishName: 'Jonah' },
  { name: 'Miquéias', abbrev: 'mq', chapters: 7, testament: 'VT', englishName: 'Micah' },
  { name: 'Naum', abbrev: 'na', chapters: 3, testament: 'VT', englishName: 'Nahum' },
  { name: 'Habacuque', abbrev: 'hc', chapters: 3, testament: 'VT', englishName: 'Habakkuk' },
  { name: 'Sofonias', abbrev: 'sf', chapters: 3, testament: 'VT', englishName: 'Zephaniah' },
  { name: 'Ageu', abbrev: 'ag', chapters: 2, testament: 'VT', englishName: 'Haggai' },
  { name: 'Zacarias', abbrev: 'zc', chapters: 14, testament: 'VT', englishName: 'Zechariah' },
  { name: 'Malaquias', abbrev: 'ml', chapters: 4, testament: 'VT', englishName: 'Malachi' },
  { name: 'Mateus', abbrev: 'mt', chapters: 28, testament: 'NT', englishName: 'Matthew' },
  { name: 'Marcos', abbrev: 'mc', chapters: 16, testament: 'NT', englishName: 'Mark' },
  { name: 'Lucas', abbrev: 'lc', chapters: 24, testament: 'NT', englishName: 'Luke' },
  { name: 'João', abbrev: 'jo', chapters: 21, testament: 'NT', englishName: 'John' },
  { name: 'Atos', abbrev: 'at', chapters: 28, testament: 'NT', englishName: 'Acts' },
  { name: 'Romanos', abbrev: 'rm', chapters: 16, testament: 'NT', englishName: 'Romans' },
  { name: '1 Coríntios', abbrev: '1co', chapters: 16, testament: 'NT', englishName: '1 Corinthians' },
  { name: '2 Coríntios', abbrev: '2co', chapters: 13, testament: 'NT', englishName: '2 Corinthians' },
  { name: 'Gálatas', abbrev: 'gl', chapters: 6, testament: 'NT', englishName: 'Galatians' },
  { name: 'Efésios', abbrev: 'ef', chapters: 6, testament: 'NT', englishName: 'Ephesians' },
  { name: 'Filipenses', abbrev: 'fp', chapters: 4, testament: 'NT', englishName: 'Philippians' },
  { name: 'Colossenses', abbrev: 'cl', chapters: 4, testament: 'NT', englishName: 'Colossians' },
  { name: '1 Tessalonicenses', abbrev: '1ts', chapters: 5, testament: 'NT', englishName: '1 Thessalonians' },
  { name: '2 Tessalonicenses', abbrev: '2ts', chapters: 3, testament: 'NT', englishName: '2 Thessalonians' },
  { name: '1 Timóteo', abbrev: '1tm', chapters: 6, testament: 'NT', englishName: '1 Timothy' },
  { name: '2 Timóteo', abbrev: '2tm', chapters: 4, testament: 'NT', englishName: '2 Timothy' },
  { name: 'Tito', abbrev: 'tt', chapters: 3, testament: 'NT', englishName: 'Titus' },
  { name: 'Filemom', abbrev: 'fm', chapters: 1, testament: 'NT', englishName: 'Philemon' },
  { name: 'Hebreus', abbrev: 'hb', chapters: 13, testament: 'NT', englishName: 'Hebrews' },
  { name: 'Tiago', abbrev: 'tg', chapters: 5, testament: 'NT', englishName: 'James' },
  { name: '1 Pedro', abbrev: '1pe', chapters: 5, testament: 'NT', englishName: '1 Peter' },
  { name: '2 Pedro', abbrev: '2pe', chapters: 3, testament: 'NT', englishName: '2 Peter' },
  { name: '1 João', abbrev: '1jo', chapters: 5, testament: 'NT', englishName: '1 John' },
  { name: '2 João', abbrev: '2jo', chapters: 1, testament: 'NT', englishName: '2 John' },
  { name: '3 João', abbrev: '3jo', chapters: 1, testament: 'NT', englishName: '3 John' },
  { name: 'Judas', abbrev: 'jd', chapters: 1, testament: 'NT', englishName: 'Jude' },
  { name: 'Apocalipse', abbrev: 'ap', chapters: 22, testament: 'NT', englishName: 'Revelation' },
];

const generateVerses = () => {
  const verses = [];
  for (const book of bibleBooks) {
    const bookData = bibleARC.books[book.name] || bibleARC.books[book.englishName];
    if (bookData && bookData.chapters) {
      for (const chapterNum in bookData.chapters) {
        if (bookData.chapters[chapterNum]) {
          bookData.chapters[chapterNum].forEach((verseText, verseIndex) => {
            const verseNum = verseIndex + 1;
            verses.push({
              id: `${book.abbrev}-${chapterNum}-${verseNum}`,
              bookAbbrev: book.abbrev,
              bookName: book.name,
              chapter: parseInt(chapterNum, 10),
              verse: verseNum,
              text: verseText,
              testament: book.testament,
            });
          });
        }
      }
    }
  }
  return verses;
};

export const bibleVerses = generateVerses();

export const bibleVersions = [
  { value: 'ARC', label: 'Almeida Revista e Corrigida' },
];