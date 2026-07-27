import React, { createContext, useContext, useState, useEffect } from 'react';
import { APP_PARAMS } from './app-params';

const AuthContext = createContext(null);

const DEFAULT_DOCUMENTS = [
  {
    id: 'doc-1',
    title: 'The Art of Deep Work & Focus',
    type: 'pdf',
    extracted_text: `Deep work is the ability to focus without distraction on a cognitively demanding task. It is a skill that allows you to quickly master complicated information and produce better results in less time. Deep work will make you better at what you do and provide the sense of true fulfillment that comes from craftsmanship.

In short, deep work is like a super power in our increasingly competitive twenty-first century economy. And yet, most people have lost the capacity to go deep—spending their days instead in a frantic blur of e-mail and social media, not even realizing there's a better way.

Hypothesis 1: The Ability to Perform Deep Work is Becoming Increasingly Rare.
At the same time that deep work is becoming more valuable, it is also becoming rarer. Consequently, the few who cultivate this skill, and then make it the core of their working life, will thrive.

Hypothesis 2: Deep Work is Valuable.
In the modern economy, two core capabilities are vital: 1. The ability to quickly master hard things. 2. The ability to produce at an elite level, in terms of both quality and speed. Both depend on your ability to perform deep work.

To build a deep work habit, you must create rituals and routines designed to minimize the willpower required to transition into and maintain a state of unbroken concentration.`,
    total_pages: 12,
    current_page: 3,
    cover_color: '#4f46e5', // indigo-600
    status: 'reading',
    reading_time_minutes: 8,
    listening_time_minutes: 15,
    summary: 'Deep work is a critical cognitive skill in the modern economy. Cultivating uninterrupted focus enables rapid learning and elite output.',
    tags: ['Productivity', 'Focus', 'Cognition'],
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'doc-2',
    title: 'Atomic Habits: Systems vs Goals',
    type: 'text',
    extracted_text: `Habits are the compound interest of self-improvement. The same way that money multiplies through compound interest, the effects of your habits multiply as you repeat them. They seem to make little difference on any given day and yet the impact they deliver over the months and years can be enormous.

Goals are about the results you want to achieve. Systems are about the processes that lead to those results.

If you're having trouble changing your habits, the problem isn't you. The problem is your system. Bad habits repeat themselves again and again not because you don't want to change, but because you have the wrong system for change.

You do not rise to the level of your goals. You fall to the level of your systems.

The 4 Laws of Behavior Change:
1. Make it obvious.
2. Make it attractive.
3. Make it easy.
4. Make it satisfying.

Focusing on who you wish to become rather than what you want to achieve reshapes your identity from the inside out. Every action you take is a vote for the type of person you wish to become.`,
    total_pages: 5,
    current_page: 5,
    cover_color: '#0d9488', // teal-600
    status: 'completed',
    reading_time_minutes: 5,
    listening_time_minutes: 10,
    summary: 'Focus on systems rather than goals. Small 1% improvements compound over time into dramatic personal transformation.',
    tags: ['Habits', 'Self-Improvement', 'Psychology'],
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
  {
    id: 'doc-3',
    title: 'Modern Architecture & Clean Code Principles',
    type: 'docx',
    extracted_text: `Clean code is code that has been written in a way that is easy to read, understand, and modify by any developer. It is simple, direct, and avoids unnecessary complexity. Writing clean code requires discipline and a commitment to quality.

Key Principles of Clean Code:
1. Meaningful Names: Choose intention-revealing names for variables, functions, and classes. Avoid acronyms or arbitrary abbreviations.
2. Small Functions: Functions should do one thing, do it well, and do it only. They should ideally be short and focused.
3. Single Responsibility Principle (SRP): A class or component should have only one reason to change.
4. Readable Control Flow: Keep conditionals straightforward and extract complex Boolean expressions into descriptive functions.

Architecture is about the decisions that are hard to change later. Decoupling components through clear interfaces ensures that individual modules can evolve independently without breaking system integrity.`,
    total_pages: 8,
    current_page: 1,
    cover_color: '#d97706', // amber-600
    status: 'unread',
    reading_time_minutes: 6,
    listening_time_minutes: 0,
    summary: 'A foundational guide on software modularity, readability, and scalable system design.',
    tags: ['Software', 'Architecture', 'Clean Code'],
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
];

const DEFAULT_NOTES = [
  {
    id: 'note-1',
    document_id: 'doc-1',
    type: 'highlight',
    content: 'You do not rise to the level of your goals. You fall to the level of your systems.',
    color: '#fef08a', // yellow highlight
    page_number: 2,
    position: 120,
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: 'note-2',
    document_id: 'doc-1',
    type: 'bookmark',
    content: 'Chapter 3: Hypothesis 1 — The Rarity of Deep Work',
    color: '#bfdbfe', // blue bookmark
    page_number: 3,
    position: 450,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'note-3',
    document_id: 'doc-2',
    type: 'sticky_note',
    content: 'Remember to apply the 4 laws when designing my morning study routine!',
    color: '#fbcfe8', // pink note
    page_number: 1,
    position: 80,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  }
];

const DEFAULT_USER = {
  name: 'Alex Rivera',
  email: 'alex.rivera@example.com',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  streak: 5,
  totalListeningHours: 4.2,
  totalNotes: 3,
};

const DEFAULT_SETTINGS = {
  darkMode: false,
  fontStyle: 'serif', // serif, sans, mono
  fontSize: 'medium', // small, medium, large
  voiceName: '',
  speed: 1.0,
  pitch: 1.0,
  autoPlay: false,
};

export const AuthProvider = ({ children }) => {
  const [user] = useState(DEFAULT_USER);
  
  // Documents state
  const [documents, setDocuments] = useState(() => {
    const saved = localStorage.getItem(APP_PARAMS.storageKeys.documents);
    return saved ? JSON.parse(saved) : DEFAULT_DOCUMENTS;
  });

  // Notes state
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem(APP_PARAMS.storageKeys.notes);
    return saved ? JSON.parse(saved) : DEFAULT_NOTES;
  });

  // Settings state
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem(APP_PARAMS.storageKeys.settings);
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  // Save documents to local storage
  useEffect(() => {
    localStorage.setItem(APP_PARAMS.storageKeys.documents, JSON.stringify(documents));
  }, [documents]);

  // Save notes to local storage
  useEffect(() => {
    localStorage.setItem(APP_PARAMS.storageKeys.notes, JSON.stringify(notes));
  }, [notes]);

  // Save settings to local storage & apply Dark Mode to html tag
  useEffect(() => {
    localStorage.setItem(APP_PARAMS.storageKeys.settings, JSON.stringify(settings));
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings]);

  // Actions
  const addDocument = (newDoc) => {
    const doc = {
      id: `doc-${Date.now()}`,
      createdAt: new Date().toISOString(),
      current_page: 1,
      status: 'unread',
      listening_time_minutes: 0,
      reading_time_minutes: Math.ceil((newDoc.extracted_text || '').split(/\s+/).length / 200) || 3,
      tags: newDoc.tags || ['Study'],
      cover_color: newDoc.cover_color || '#4f46e5',
      ...newDoc,
    };
    setDocuments((prev) => [doc, ...prev]);
    return doc;
  };

  const updateDocument = (id, updates) => {
    setDocuments((prev) =>
      prev.map((doc) => (doc.id === id ? { ...doc, ...updates } : doc))
    );
  };

  const deleteDocument = (id) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== id));
    setNotes((prev) => prev.filter((note) => note.document_id !== id));
  };

  const addNote = (newNote) => {
    const note = {
      id: `note-${Date.now()}`,
      createdAt: new Date().toISOString(),
      color: newNote.color || '#fef08a',
      page_number: newNote.page_number || 1,
      ...newNote,
    };
    setNotes((prev) => [note, ...prev]);
    return note;
  };

  const deleteNote = (id) => {
    setNotes((prev) => prev.filter((note) => note.id !== id));
  };

  const updateSettings = (updates) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        documents,
        notes,
        settings,
        addDocument,
        updateDocument,
        deleteDocument,
        addNote,
        deleteNote,
        updateSettings,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
