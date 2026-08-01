import { create } from 'zustand';

export type SceneName =
  | 'intro'
  | 'blow'
  | 'celebration'
  | 'message'
  | 'world'
  | 'finale';

interface BirthdayState {
  scene: SceneName;
  roomsVisited: string[];
  activeRoom: string | null;
  micAllowed: boolean;

  // Actions
  setScene: (scene: SceneName) => void;
  nextScene: () => void;
  enterRoom: (id: string) => void;
  exitRoom: () => void;
  visitRoom: (id: string) => void;
  setMicAllowed: (allowed: boolean) => void;
  allRoomsVisited: () => boolean;
}

const SCENE_ORDER: SceneName[] = [
  'intro',
  'blow',
  'celebration',
  'message',
  'world',
  'finale',
];

export const useBirthdayStore = create<BirthdayState>((set, get) => ({
  scene: 'intro',
  roomsVisited: [],
  activeRoom: null,
  micAllowed: false,

  setScene: (scene) => set({ scene }),

  nextScene: () => {
    const current = get().scene;
    const idx = SCENE_ORDER.indexOf(current);
    if (idx < SCENE_ORDER.length - 1) {
      set({ scene: SCENE_ORDER[idx + 1] });
    }
  },

  enterRoom: (id) => set({ activeRoom: id }),

  exitRoom: () => set({ activeRoom: null }),

  visitRoom: (id) =>
    set((state) => ({
      roomsVisited: state.roomsVisited.includes(id)
        ? state.roomsVisited
        : [...state.roomsVisited, id],
    })),

  setMicAllowed: (allowed) => set({ micAllowed: allowed }),

  allRoomsVisited: () => {
    // This is a derived check, not stored state
    const { roomsVisited } = get();
    // We import CONFIG.friends.length elsewhere; here we just expose the check
    return roomsVisited.length >= 10;
  },
}));
