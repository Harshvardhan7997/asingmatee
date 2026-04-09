export interface User {
  id: string;
  username: string;
  email: string;
  role: 'student' | 'admin';
  avatar?: string;
  level: number;
  xp: number;
  xpToNext: number;
  streak: number;
  badges: Badge[];
  joinedAt: string;
  subjects: string[];
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  unlockedAt?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  description: string;
  dueDate: string;
  language: 'python' | 'cpp' | 'java';
  starterCode: string;
  idealSolution: string;
  maxScore: number;
  status: 'pending' | 'submitted' | 'graded';
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  code: string;
  score: number;
  submittedAt: string;
  compilerOutput: string;
  radarScores: { logic: number; syntax: number; clarity: number; problemSolving: number; knowledge: number };
}

export interface StudentStats {
  id: string;
  username: string;
  level: number;
  xp: number;
  avgScore: number;
  streak: number;
  focusTime: number;
  compilerErrors: number;
  riskLevel: 'low' | 'medium' | 'high';
  lastActive: string;
  submissions: number;
}

export const SUBJECTS = [
  { id: 'math', name: 'Mathematics', icon: 'Calculator', color: 'neon-cyan' },
  { id: 'dsa', name: 'Data Structures', icon: 'GitBranch', color: 'neon-purple' },
  { id: 'cpp', name: 'C++ Programming', icon: 'Code2', color: 'neon-orange' },
  { id: 'python', name: 'Python', icon: 'Terminal', color: 'neon-green' },
  { id: 'java', name: 'Java', icon: 'Coffee', color: 'neon-blue' },
  { id: 'web', name: 'Web Development', icon: 'Globe', color: 'neon-yellow' },
];

export const DIFFICULTY_COLORS: Record<string, string> = {
  easy: 'text-neon-green',
  medium: 'text-neon-yellow',
  hard: 'text-neon-orange',
  expert: 'text-neon-red',
};

export const ALL_BADGES: Badge[] = [
  { id: 'architect', name: 'The Architect', icon: 'Building2', description: 'Zero compiler errors on submission', rarity: 'epic' },
  { id: 'night-owl', name: 'Night Owl', icon: 'Moon', description: 'High accuracy 12AM–5AM submissions', rarity: 'rare' },
  { id: 'comeback', name: 'The Comeback Kid', icon: 'TrendingUp', description: 'Jump from <60% to >90%', rarity: 'legendary' },
  { id: 'streak-7', name: 'On Fire', icon: 'Flame', description: '7-day activity streak', rarity: 'common' },
  { id: 'early-bird', name: 'Early Bird', icon: 'Sun', description: 'Submit 24h before deadline', rarity: 'common' },
  { id: 'clean-code', name: 'Clean Coder', icon: 'CheckCircle', description: 'Pass all tests on first try', rarity: 'rare' },
  { id: 'polyglot', name: 'Polyglot', icon: 'Languages', description: 'Complete tasks in 3+ languages', rarity: 'epic' },
  { id: 'speed-demon', name: 'Speed Demon', icon: 'Zap', description: 'Complete assignment in under 10 min', rarity: 'rare' },
];

export const MOCK_ASSIGNMENTS: Assignment[] = [
  {
    id: 'a1', title: 'Binary Search Implementation', subject: 'dsa', difficulty: 'medium',
    description: 'Implement binary search algorithm for a sorted array. Return the index of the target element or -1 if not found.',
    dueDate: new Date(Date.now() + 86400000 * 3).toISOString(), language: 'python',
    starterCode: `def binary_search(arr, target):\n    # Your code here\n    pass\n\n# Test\nprint(binary_search([1,3,5,7,9], 5))`,
    idealSolution: `def binary_search(arr, target):\n    left, right = 0, len(arr) - 1\n    while left <= right:\n        mid = (left + right) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    return -1`,
    maxScore: 100, status: 'pending',
  },
  {
    id: 'a2', title: 'Linked List Reversal', subject: 'dsa', difficulty: 'hard',
    description: 'Reverse a singly linked list. Return the new head of the reversed list.',
    dueDate: new Date(Date.now() + 86400000 * 5).toISOString(), language: 'cpp',
    starterCode: `#include <iostream>\nusing namespace std;\n\nstruct Node {\n    int data;\n    Node* next;\n};\n\nNode* reverseList(Node* head) {\n    // Your code here\n    return nullptr;\n}`,
    idealSolution: `Node* reverseList(Node* head) {\n    Node* prev = nullptr;\n    Node* curr = head;\n    while (curr) {\n        Node* next = curr->next;\n        curr->next = prev;\n        prev = curr;\n        curr = next;\n    }\n    return prev;\n}`,
    maxScore: 100, status: 'pending',
  },
  {
    id: 'a3', title: 'Matrix Multiplication', subject: 'math', difficulty: 'easy',
    description: 'Multiply two NxN matrices and return the result.',
    dueDate: new Date(Date.now() + 86400000 * 7).toISOString(), language: 'java',
    starterCode: `public class MatrixMultiply {\n    public static int[][] multiply(int[][] a, int[][] b) {\n        // Your code here\n        return null;\n    }\n}`,
    idealSolution: `public static int[][] multiply(int[][] a, int[][] b) {\n    int n = a.length;\n    int[][] result = new int[n][n];\n    for (int i = 0; i < n; i++)\n        for (int j = 0; j < n; j++)\n            for (int k = 0; k < n; k++)\n                result[i][j] += a[i][k] * b[k][j];\n    return result;\n}`,
    maxScore: 100, status: 'pending',
  },
  {
    id: 'a4', title: 'Fibonacci with Memoization', subject: 'python', difficulty: 'easy',
    description: 'Implement Fibonacci sequence with memoization for efficiency.',
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString(), language: 'python',
    starterCode: `def fibonacci(n, memo={}):\n    # Your code here\n    pass\n\nfor i in range(10):\n    print(fibonacci(i))`,
    idealSolution: `def fibonacci(n, memo={}):\n    if n in memo:\n        return memo[n]\n    if n <= 1:\n        return n\n    memo[n] = fibonacci(n-1, memo) + fibonacci(n-2, memo)\n    return memo[n]`,
    maxScore: 100, status: 'pending',
  },
];

export const MOCK_STUDENTS: StudentStats[] = [
  { id: 's1', username: 'Sarah_K', level: 12, xp: 2400, avgScore: 87, streak: 14, focusTime: 45, compilerErrors: 3, riskLevel: 'low', lastActive: '2h ago', submissions: 28 },
  { id: 's2', username: 'Mike_T', level: 8, xp: 1600, avgScore: 72, streak: 3, focusTime: 30, compilerErrors: 12, riskLevel: 'medium', lastActive: '1d ago', submissions: 19 },
  { id: 's3', username: 'Emma_R', level: 15, xp: 3200, avgScore: 95, streak: 21, focusTime: 60, compilerErrors: 1, riskLevel: 'low', lastActive: '30m ago', submissions: 35 },
  { id: 's4', username: 'John_D', level: 4, xp: 600, avgScore: 54, streak: 0, focusTime: 15, compilerErrors: 24, riskLevel: 'high', lastActive: '5d ago', submissions: 8 },
  { id: 's5', username: 'Lisa_W', level: 10, xp: 2000, avgScore: 81, streak: 7, focusTime: 40, compilerErrors: 6, riskLevel: 'low', lastActive: '4h ago', submissions: 22 },
  { id: 's6', username: 'Alex_P', level: 6, xp: 1100, avgScore: 63, streak: 1, focusTime: 22, compilerErrors: 18, riskLevel: 'high', lastActive: '3d ago', submissions: 12 },
];

export const LEADERBOARD = MOCK_STUDENTS.sort((a, b) => b.xp - a.xp).map((s, i) => ({ ...s, rank: i + 1 }));

export const SKILL_TREE_NODES = [
  { id: 'algo', name: 'Algorithmic Thinking', x: 200, y: 50, unlocked: true, children: ['sort', 'search'] },
  { id: 'sort', name: 'Sorting Mastery', x: 100, y: 150, unlocked: true, children: ['graph'] },
  { id: 'search', name: 'Search Patterns', x: 300, y: 150, unlocked: true, children: ['dp'] },
  { id: 'graph', name: 'Graph Theory', x: 50, y: 250, unlocked: false, children: [] },
  { id: 'dp', name: 'Dynamic Programming', x: 350, y: 250, unlocked: false, children: [] },
  { id: 'syntax', name: 'Syntax Mastery', x: 200, y: 350, unlocked: false, children: [] },
];

export const MOCK_COMPILER_OUTPUTS: Record<string, string> = {
  success: '✅ Compilation successful\n📊 All test cases passed (5/5)\n⏱ Runtime: 0.03s\n💾 Memory: 2.1MB',
  error_python: '❌ SyntaxError: unexpected indent\n  File "main.py", line 4\n    return mid\n    ^\nIndentationError: unexpected indent',
  error_cpp: '❌ error: expected \';\' after expression\n  main.cpp:12:24: error\n    Node* next = curr->next\n                           ^\n1 error generated.',
  error_java: '❌ error: \';\' expected\n  MatrixMultiply.java:5: error\n    int n = a.length\n                    ^\n1 error',
};

export const LANGUAGES = [
  { id: 'python', name: 'Python 3', icon: '🐍' },
  { id: 'cpp', name: 'C++', icon: '⚡' },
  { id: 'java', name: 'Java', icon: '☕' },
];
