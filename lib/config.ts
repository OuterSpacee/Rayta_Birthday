export type Keepsake = 'photo' | 'letters' | 'trinket' | 'poster';
export type AvatarGender = 'boy' | 'girl';

export type Friend = {
  id: string;
  name: string;
  doorPosition: number;
  wallColor: string;
  accentColor: string;
  avatar: AvatarGender;
  keepsake: Keepsake;
  audioSrc: string;
  note?: string;
};

export const CONFIG = {
  name: 'Rayta Hasan',
  firstName: 'Rayta',

  friends: [
    {
      id: 'friend-1',
      name: 'Abrar (Ryuk)',
      doorPosition: 0,
      wallColor: '#1c1810',
      accentColor: '#ffaa00',
      avatar: 'boy' as AvatarGender,
      keepsake: 'photo' as Keepsake,
      audioSrc: '/audio/voices/friend-1.mp4',
      note: 'Wishing you an amazing year ahead, Rayta!',
    },
    {
      id: 'friend-2',
      name: 'Tasfia',
      doorPosition: 1,
      wallColor: '#220d14',
      accentColor: '#f43f5e',
      avatar: 'girl' as AvatarGender,
      keepsake: 'photo' as Keepsake,
      audioSrc: '/audio/voices/friend-2.mp4',
      note: 'Wishing you happiness today and always.',
    },
    {
      id: 'friend-3',
      name: 'Suchi',
      doorPosition: 2,
      wallColor: '#220e1a',
      accentColor: '#ec4899',
      avatar: 'girl' as AvatarGender,
      keepsake: 'photo' as Keepsake,
      audioSrc: '/audio/voices/friend-3.mp4',
      note: 'Sending you so much love on your birthday!',
    },
    {
      id: 'friend-4',
      name: 'Arpita',
      doorPosition: 3,
      wallColor: '#201018',
      accentColor: '#ff2a5f',
      avatar: 'girl' as AvatarGender,
      keepsake: 'photo' as Keepsake,
      audioSrc: '/audio/voices/friend-4.mp4',
      note: 'Happy Birthday Rayta! Stay shining always.',
    },
    {
      id: 'friend-5',
      name: 'Azaan',
      doorPosition: 4,
      wallColor: '#0a1d12',
      accentColor: '#00ff66',
      avatar: 'boy' as AvatarGender,
      keepsake: 'photo' as Keepsake,
      audioSrc: '/audio/voices/friend-5.mp4',
      note: 'Hope your special day is filled with joy!',
    },
    {
      id: 'friend-6',
      name: 'Catwing',
      doorPosition: 5,
      wallColor: '#0c1b22',
      accentColor: '#00e5ff',
      avatar: 'girl' as AvatarGender,
      keepsake: 'photo' as Keepsake,
      audioSrc: '/audio/voices/friend-6.mp4',
      note: 'To endless laughter and great times together.',
    },
    {
      id: 'friend-7',
      name: 'Mansif',
      doorPosition: 6,
      wallColor: '#1a1026',
      accentColor: '#a855f7',
      avatar: 'boy' as AvatarGender,
      keepsake: 'photo' as Keepsake,
      audioSrc: '/audio/voices/friend-7.mp4',
      note: 'Happy Birthday! Have an unforgettable day.',
    },
    {
      id: 'friend-8',
      name: 'Sabit',
      doorPosition: 7,
      wallColor: '#22140a',
      accentColor: '#f97316',
      avatar: 'boy' as AvatarGender,
      keepsake: 'photo' as Keepsake,
      audioSrc: '/audio/voices/friend-8.mp4',
      note: 'Cheers to another year of awesome memories!',
    },
    {
      id: 'friend-9',
      name: 'Shine',
      doorPosition: 8,
      wallColor: '#1f1b0a',
      accentColor: '#eab308',
      avatar: 'girl' as AvatarGender,
      keepsake: 'photo' as Keepsake,
      audioSrc: '/audio/voices/friend-9.mp4',
      note: 'May your year be as bright as your smile.',
    },
    {
      id: 'friend-10',
      name: 'Simp',
      doorPosition: 9,
      wallColor: '#091c16',
      accentColor: '#10b981',
      avatar: 'boy' as AvatarGender,
      keepsake: 'photo' as Keepsake,
      audioSrc: '/audio/voices/friend-10.m4a',
      note: 'Happy Birthday, Rayta! Enjoy your day.',
    },
    {
      id: 'friend-11',
      name: 'Upam',
      doorPosition: 10,
      wallColor: '#0d1626',
      accentColor: '#3b82f6',
      avatar: 'boy' as AvatarGender,
      keepsake: 'photo' as Keepsake,
      audioSrc: '/audio/voices/friend-11.mp4',
      note: 'Best wishes on your birthday, Rayta!',
    },
    {
      id: 'friend-12',
      name: 'Likhon (OuterSpace)',
      doorPosition: 11,
      wallColor: '#111029',
      accentColor: '#6366f1',
      avatar: 'boy' as AvatarGender,
      keepsake: 'photo' as Keepsake,
      audioSrc: '/audio/voices/friend-12.m4a',
      note: 'Sending birthday wishes from outer space!',
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
