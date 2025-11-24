// src/services/apiService.ts
import { MOCK_EMAILS, FOLDERS, type Email } from "@/data/mockData";
import api from "@/lib/api";
import axios from "axios";
// Import các kiểu Zod từ form của bạn (Giả sử bạn export chúng)
// Hoặc định nghĩa lại kiểu Login/Register ở đây

// Giả sử kiểu Zod từ SignInPage
type LoginFormValues = {
  email: string;
  password: string;
};

// Giả sử kiểu Zod từ SignUpPage
type RegisterFormValues = {
  email: string;
  password: string;
};

// Backend trả về kiểu này khi login
type LoginResponse = {
  accessToken: string;
  refreshToken: string;
};

// Backend trả về kiểu này khi refresh
type RefreshResponse = {
  accessToken: string;
};

// Backend trả về kiểu này từ /user/me
type UserProfile = {
  _id: string;
  email: string;
  // ... các trường khác
};

// ========================================================
// 1. Auth Service
// ========================================================
export const loginUser = async (
  values: LoginFormValues
): Promise<LoginResponse> => {
  // Dùng endpoint /auth/login của NestJS
  const { data } = await api.post("/auth/login", values);
  return data;
};

export const registerUser = async (values: RegisterFormValues) => {
  // Dùng endpoint /user/register
  const { email, password } = values;
  const { data } = await api.post("/user/register", { email, password });
  return data;
};

export const refreshAccessToken = async (): Promise<RefreshResponse> => {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) {
    throw new Error("No refresh token available");
  }
  // Dùng axios gốc để tránh vòng lặp interceptor khi init
  const { data } = await axios.post(
    `${import.meta.env.VITE_API_URL}/auth/refresh`,
    { refreshToken }
  );
  return data;
};

// ========================================================
// 2. User Service
// ========================================================
export const fetchUserProfile = async (): Promise<UserProfile> => {
  const { data } = await api.get("/user/me");
  return data;
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
// ========================================================
// 3. Email Data Service (Mock Endpoints)
// ========================================================

// GET /mailboxes
export const fetchMailboxes = async () => {
  await delay(300);
  return FOLDERS;
};

// GET /mailboxes/:id/emails
export const fetchEmails = async (folderId: string): Promise<Email[]> => {
  await delay(600); // Giả lập loading
  
  if (folderId === "starred") {
    return MOCK_EMAILS.filter((e) => e.isStarred);
  }
  return MOCK_EMAILS.filter((e) => e.folder === folderId);
};

// GET /emails/:id
export const fetchEmailDetail = async (emailId: string): Promise<Email | undefined> => {
  await delay(400);
  return MOCK_EMAILS.find((e) => e.id === emailId);
};