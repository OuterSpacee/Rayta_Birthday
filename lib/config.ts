export type Keepsake = 'photo' | 'letters' | 'trinket' | 'poster';

export type Friend = {
  id: string;
  name: string;
  doorPosition: number;       // 0–9, placed around the hallway circle
  wallColor: string;           // hex color for their room walls
  accentColor: string;         // glow/highlight color for their room
  keepsake: Keepsake;          // the one prop that makes the room theirs
  audioSrc: string;            // voice-over recording path
  note?: string;               // small caption revealed with the keepsake
};

export const CONFIG = {
  name: 'Rayta Hasan',
  firstName: 'Rayta',

  friends: [
    {
      id: 'friend-1',
      name: 'Friend 1',
      doorPosition: 0,
      wallColor: '#1a1520',
      accentColor: '#ffaa00',
      keepsake: 'photo' as Keepsake,
      audioSrc: '/audio/voices/friend-1.mp3',
      note: 'A cherished memory together.',
    },
    {
      id: 'friend-2',
      name: 'Friend 2',
      doorPosition: 1,
      wallColor: '#15131f',
      accentColor: '#00ff66',
      keepsake: 'letters' as Keepsake,
      audioSrc: '/audio/voices/friend-2.mp3',
      note: 'Words that meant the world.',
    },
    {
      id: 'friend-3',
      name: 'Friend 3',
      doorPosition: 2,
      wallColor: '#1c1418',
      accentColor: '#ff2a5f',
      keepsake: 'trinket' as Keepsake,
      audioSrc: '/audio/voices/friend-3.mp3',
      note: 'A little something special.',
    },
    {
      id: 'friend-4',
      name: 'Friend 4',
      doorPosition: 3,
      wallColor: '#141a1a',
      accentColor: '#ffaa00',
      keepsake: 'poster' as Keepsake,
      audioSrc: '/audio/voices/friend-4.mp3',
      note: 'Remember this moment?',
    },
    {
      id: 'friend-5',
      name: 'Friend 5',
      doorPosition: 4,
      wallColor: '#18151c',
      accentColor: '#00ff66',
      keepsake: 'photo' as Keepsake,
      audioSrc: '/audio/voices/friend-5.mp3',
      note: 'Captured in time.',
    },
    {
      id: 'friend-6',
      name: 'Friend 6',
      doorPosition: 5,
      wallColor: '#1a1318',
      accentColor: '#ff2a5f',
      keepsake: 'letters' as Keepsake,
      audioSrc: '/audio/voices/friend-6.mp3',
      note: 'Every word, heartfelt.',
    },
    {
      id: 'friend-7',
      name: 'Friend 7',
      doorPosition: 6,
      wallColor: '#151a14',
      accentColor: '#ffaa00',
      keepsake: 'trinket' as Keepsake,
      audioSrc: '/audio/voices/friend-7.mp3',
      note: 'Small but meaningful.',
    },
    {
      id: 'friend-8',
      name: 'Friend 8',
      doorPosition: 7,
      wallColor: '#14151c',
      accentColor: '#00ff66',
      keepsake: 'poster' as Keepsake,
      audioSrc: '/audio/voices/friend-8.mp3',
      note: 'Our favorite shared moment.',
    },
    {
      id: 'friend-9',
      name: 'Friend 9',
      doorPosition: 8,
      wallColor: '#1c1515',
      accentColor: '#ff2a5f',
      keepsake: 'photo' as Keepsake,
      audioSrc: '/audio/voices/friend-9.mp3',
      note: 'A snapshot of joy.',
    },
    {
      id: 'friend-10',
      name: 'Friend 10',
      doorPosition: 9,
      wallColor: '#151318',
      accentColor: '#ffaa00',
      keepsake: 'letters' as Keepsake,
      audioSrc: '/audio/voices/friend-10.mp3',
      note: 'From the heart.',
    },
  ] as Friend[],

  messages: {
    birthday: 'HAPPY BIRTHDAY',
    finaleNote:
      'Every room you walked through, every voice you heard — that\'s how much you\'re loved.\nHappy Birthday, Rayta.\nHere\'s to another year of being extraordinary.',
  },

  assets: {
    sfx: {
      flowerBurst: '/audio/sfx/flower-burst.mp3',
      door: '/audio/sfx/door.mp3',
      firework: '/audio/sfx/firework.mp3',
      ambient: '/audio/sfx/ambient.mp3',
      whoosh: '/audio/sfx/whoosh.mp3',
      chime: '/audio/sfx/chime.mp3',
      candleBlow: '/audio/sfx/candle-blow.mp3',
    },
  },
} as const;
