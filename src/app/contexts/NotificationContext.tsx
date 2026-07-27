import { createContext, useContext, useState } from "react";
import { toast } from "sonner";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "error";
  category: "pedido" | "preco" | "financeiro" | "comunicado" | "sistema";
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, "id" | "timestamp" | "read">) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotification: (id: string) => void;
  unreadCount: number;
  requestPushPermission: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Preço do Bovino Atualizado",
      message: "O preço do bovino subiu 2.5% hoje",
      type: "info",
      category: "preco",
      timestamp: new Date(Date.now() - 1000 * 60 * 41),
      read: false,
      actionUrl: "/precos",
    },
    {
      id: "2",
      title: "Pedido Aprovado",
      message: "Seu pedido #1234 foi aprovado",
      type: "success",
      category: "pedido",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      read: false,
      actionUrl: "/pedidos",
    },
    {
      id: "3",
      title: "Boleto Vencendo Hoje",
      message: "Boleto #5678 no valor de R$ 15.450,00 vence hoje",
      type: "warning",
      category: "financeiro",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
      read: false,
      actionUrl: "/financeiro",
    },
    {
      id: "4",
      title: "Novo Comunicado",
      message: "Alteração no horário de abate da próxima semana",
      type: "info",
      category: "comunicado",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
      read: true,
      actionUrl: "/comunicacao",
    },
    {
      id: "5",
      title: "Pedido em Produção",
      message: "Seu pedido #1230 está sendo processado",
      type: "info",
      category: "pedido",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
      read: true,
      actionUrl: "/pedidos",
    },
  ]);

  const requestPushPermission = async () => {
    if ("Notification" in window) {
      const permission = await window.Notification.requestPermission();
      if (permission === "granted") {
        toast.success("Notificações Push ativadas no seu dispositivo!");
      } else {
        toast.error("Permissão de notificação negada pelo navegador.");
      }
    } else {
      toast.error("Seu navegador não suporta Notificações Push.");
    }
  };

  const addNotification = (notification: Omit<Notification, "id" | "timestamp" | "read">) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false,
    };
    setNotifications((prev) => [newNotification, ...prev]);
    
    // Show toast
    toast[notification.type](notification.title, {
      description: notification.message,
    });

    // Native Web Push Notification if granted
    if ("Notification" in window && window.Notification.permission === "granted") {
      new window.Notification(notification.title, {
        body: notification.message,
        icon: "/favicon.ico",
      });
    }
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearNotification,
        unreadCount,
        requestPushPermission,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within NotificationProvider");
  }
  return context;
}