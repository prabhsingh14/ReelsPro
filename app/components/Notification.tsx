"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type NotificationType = "success" | "error" | "warning" | "info";

interface Notification {
    message: string;
    type: NotificationType;
    id: number;
}

interface NotificationContextType {
    showNotification: (message: string, type: NotificationType) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
    undefined
);

function getAlertClass(type: NotificationType): string {
    switch (type) {
        case "success":
            return "alert-success";
        case "error":
            return "alert-error";
        case "warning":
            return "alert-warning";
        case "info":
            return "alert-info";
        default:
            return "alert-info";
    }
}

export function NotificationProvider({ children }: { children: ReactNode }) {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const showNotification = (message: string, type: NotificationType) => {
        const id = Date.now();
        setNotifications((prev) => [...prev, { message, type, id }]);

        setTimeout(() => {
            setNotifications((prev) => prev.filter((n) => n.id !== id));
        }, 3000);
    };

    return (
        <NotificationContext.Provider value={{ showNotification }}>
            {children}
            <div className="toast toast-bottom toast-end z-[100]">
                {notifications.map((notification) => (
                    <div
                        key={notification.id}
                        className={`alert ${getAlertClass(notification.type)}`}
                    >
                        <span>{notification.message}</span>
                    </div>
                ))}
            </div>
        </NotificationContext.Provider>
    );
}

export function useNotification() {
    const context = useContext(NotificationContext);

    if (context === undefined) {
        throw new Error("useNotification must be used within a NotificationProvider");
    }

    return context;
}