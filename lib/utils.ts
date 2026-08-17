import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getFileUrl(path?: string | null) {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  // Remove leading slash if any
  let cleanPath = path.replace(/^\/+/, "");

  if (cleanPath.startsWith("uploads/")) {
    cleanPath = cleanPath.replace(/^uploads\//, "");
  }

  // If it already starts with api/files/, just return with a leading slash
  if (cleanPath.startsWith("api/files/")) {
    return `/${cleanPath}`;
  }

  return `/api/files/${cleanPath}`;
}
