"use client";

import { User } from '@/types';

const USERS_KEY = 'schedzilla_users';
const CURRENT_USER_KEY = 'schedzilla_current_user';

export class AuthService {
  private static instance: AuthService;

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  public getUsers(): User[] {
    if (typeof window === 'undefined') return [];
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
  }

  public saveUsers(users: User[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  public register(email: string, password: string, name: string): { success: boolean; message: string } {
    const users = this.getUsers();
    
    if (users.find(user => user.email === email)) {
      return { success: false, message: 'Email already exists' };
    }

    const newUser: User = {
      id: Date.now().toString(),
      email,
      name,
      password
    };

    users.push(newUser);
    this.saveUsers(users);

    return { success: true, message: 'Registration successful' };
  }

  public login(email: string, password: string): { success: boolean; message: string; user?: User } {
    const users = this.getUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
      return { success: true, message: 'Login successful', user: userWithoutPassword };
    }

    return { success: false, message: 'Invalid email or password' };
  }

  public logout(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(CURRENT_USER_KEY);
  }

  public getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null;
    const user = localStorage.getItem(CURRENT_USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  public isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }
}